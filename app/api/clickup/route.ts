import { NextResponse } from "next/server";

interface ClickUpTask {
  id: string;
  name: string;
  status: { status: string; color: string };
  priority: { priority: string } | null;
  due_date: string | null;
  assignees: { username: string; initials: string }[];
  list: { name: string };
  date_updated: string;
}

export async function GET() {
  const token = process.env.CLICKUP_API_TOKEN;
  const teamId = process.env.CLICKUP_TEAM_ID || "9014714949";

  if (!token) {
    return NextResponse.json(
      { error: "ClickUp API token not configured", tasks: [] },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `https://api.clickup.com/api/v2/team/${teamId}/task?page=0&order_by=due_date&reverse=true&limit=30`,
      {
        headers: { Authorization: token },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`ClickUp API returned ${res.status}`);
    }

    const data = await res.json();
    const tasks = (data.tasks || []).map((t: ClickUpTask) => ({
      id: t.id,
      name: t.name,
      status: t.status?.status || "Unknown",
      status_color: t.status?.color || "#87909e",
      priority: t.priority?.priority || "none",
      due_date: t.due_date
        ? new Date(parseInt(t.due_date)).toISOString()
        : null,
      assignees: (t.assignees || []).map(
        (a: { username: string; initials: string }) => ({
          name: a.username,
          initials: a.initials,
        })
      ),
      list: t.list?.name || "Unknown",
      updated: t.date_updated
        ? new Date(parseInt(t.date_updated)).toISOString()
        : null,
      workspace: "performance-golf",
    }));

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("ClickUp fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch ClickUp tasks", tasks: [] });
  }
}
