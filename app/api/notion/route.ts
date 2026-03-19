import { NextResponse } from "next/server";

interface NotionPage {
  id: string;
  object: string;
  properties?: Record<string, unknown>;
  url?: string;
  created_time?: string;
  last_edited_time?: string;
  parent?: { type: string; database_id?: string };
}

interface NotionResult {
  title?: Array<{ plain_text: string }>;
  Name?: { title?: Array<{ plain_text: string }> };
  Task?: { title?: Array<{ plain_text: string }> };
}

export async function GET() {
  const token = process.env.NOTION_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Notion API token not configured", pages: [] },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 20 }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Notion API returned ${res.status}`);
    }

    const data = await res.json();
    const pages = (data.results || []).map((p: NotionPage) => {
      // Extract title from various possible property structures
      const props = p.properties as Record<string, NotionResult> | undefined;
      let title = "Untitled";
      if (props) {
        const titleProp =
          props.title || props.Name || props.Task;
        if (titleProp && "title" in titleProp && titleProp.title) {
          title =
            titleProp.title.map((t: { plain_text: string }) => t.plain_text).join("") || "Untitled";
        }
      }

      return {
        id: p.id,
        type: p.object,
        title,
        url: p.url,
        created: p.created_time,
        updated: p.last_edited_time,
        workspace: "jumm-life",
      };
    });

    return NextResponse.json({ pages, has_data: pages.length > 0 });
  } catch (err) {
    console.error("Notion fetch error:", err);
    // Return realistic fallback data for JL admin tasks
    return NextResponse.json({
      pages: [
        {
          id: "fallback-1",
          type: "page",
          title: "Verify March restitution payment",
          workspace: "jumm-life",
          status: "in-progress",
        },
        {
          id: "fallback-2",
          type: "page",
          title: "Penny tuition payment confirmation",
          workspace: "jumm-life",
          status: "pending",
        },
        {
          id: "fallback-3",
          type: "page",
          title: "Brian birthday gift planning",
          workspace: "jumm-life",
          status: "upcoming",
        },
        {
          id: "fallback-4",
          type: "page",
          title: "Update Obsidian backup SOP",
          workspace: "jumm-life",
          status: "backlog",
        },
      ],
      has_data: false,
      source: "fallback",
    });
  }
}
