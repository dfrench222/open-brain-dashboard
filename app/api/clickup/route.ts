import { NextResponse } from "next/server";

interface ClickUpTask {
  id: string;
  name: string;
  status: { status: string; color: string };
  priority: { priority: string } | null;
  due_date: string | null;
  assignees: { id: number; username: string; email: string; initials: string }[];
  list: { name: string };
  date_updated: string;
}

interface ClickUpMember {
  user: {
    id: number;
    username: string;
    email: string;
  };
}

async function getDonUserId(token: string, teamId: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.clickup.com/api/v2/team/${teamId}/member`,
      {
        headers: { Authorization: token },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const members: ClickUpMember[] = data.members || [];
    const don = members.find(
      (m) =>
        m.user.username?.toLowerCase().includes("donnie") ||
        m.user.username?.toLowerCase().includes("don french") ||
        m.user.email?.toLowerCase() === "donnie@performancegolfzone.com" ||
        m.user.email?.toLowerCase() === "donnie@jummlife.com"
    );
    return don?.user.id ?? null;
  } catch {
    return null;
  }
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
    // Step 1: Get Don's user ID
    const donUserId = await getDonUserId(token, teamId);

    // Step 2: Build task query — filter by assignee if we found Don's ID
    let taskUrl = `https://api.clickup.com/api/v2/team/${teamId}/task?page=0&order_by=due_date&reverse=true&limit=30`;
    if (donUserId) {
      taskUrl += `&assignees[]=${donUserId}`;
    }

    const res = await fetch(taskUrl, {
      headers: { Authorization: token },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`ClickUp API returned ${res.status}`);
    }

    const data = await res.json();
    let tasks = (data.tasks || []).map((t: ClickUpTask) => ({
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

    // Step 3: Client-side fallback filter if we couldn't get Don's ID from the members API
    if (!donUserId) {
      tasks = tasks.filter((t: { assignees: { name: string }[] }) =>
        t.assignees.some(
          (a: { name: string }) =>
            a.name?.toLowerCase().includes("donnie") ||
            a.name?.toLowerCase().includes("don french")
        )
      );
    }

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("ClickUp fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch ClickUp tasks", tasks: [] });
  }
}
