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

interface NotionTitleProp {
  title?: Array<{ plain_text: string }>;
}

interface NotionStatusProp {
  status?: { name: string };
  select?: { name: string };
}

export async function GET() {
  const token = process.env.NOTION_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Notion API token not configured", pages: [], has_data: false },
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
      const props = p.properties as Record<string, NotionTitleProp & NotionStatusProp> | undefined;
      let title = "Untitled";
      let status = "";

      if (props) {
        // Extract title from various property structures
        const titleProp = props.title || props.Name || props.Task;
        if (titleProp && "title" in titleProp && titleProp.title) {
          title = titleProp.title.map((t: { plain_text: string }) => t.plain_text).join("") || "Untitled";
        }

        // Extract status
        const statusProp = props.Status || props.status;
        if (statusProp) {
          if ("status" in statusProp && statusProp.status) {
            status = statusProp.status.name;
          } else if ("select" in statusProp && statusProp.select) {
            status = statusProp.select.name;
          }
        }
      }

      return {
        id: p.id,
        type: p.object,
        title,
        status,
        url: p.url,
        created: p.created_time,
        updated: p.last_edited_time,
        workspace: "jumm-life",
      };
    });

    return NextResponse.json({ pages, has_data: pages.length > 0 });
  } catch (err) {
    console.error("Notion fetch error:", err);
    return NextResponse.json({
      pages: [],
      has_data: false,
      error: "Failed to fetch from Notion",
    });
  }
}
