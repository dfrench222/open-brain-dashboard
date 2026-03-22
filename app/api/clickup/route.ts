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
  url?: string;
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
      { headers: { Authorization: token } }
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
      { error: "ClickUp API token not configured", tasks: [], overdue: [], today: [], thisWeek: [], total: 0 },
      { status: 200 }
    );
  }

  try {
    const donUserId = await getDonUserId(token, teamId);

    let taskUrl = `https://api.clickup.com/api/v2/team/${teamId}/task?page=0&order_by=due_date&reverse=true&limit=50`;
    if (donUserId) {
      taskUrl += `&assignees[]=${donUserId}`;
    }

    const res = await fetch(taskUrl, {
      headers: { Authorization: token },
      next: { revalidate: 300 },
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
      url: `https://app.clickup.com/t/${t.id}`,
    }));

    // Client-side fallback filter if we couldn't get Don's ID
    if (!donUserId) {
      tasks = tasks.filter((t: { assignees: { name: string }[] }) =>
        t.assignees.some(
          (a: { name: string }) =>
            a.name?.toLowerCase().includes("donnie") ||
            a.name?.toLowerCase().includes("don french")
        )
      );
    }

    // Filter out closed/hold tasks for categorization
    const activeTasks = tasks.filter(
      (t: { status: string }) =>
        t.status.toLowerCase() !== "closed" &&
        t.status.toLowerCase() !== "hold for launch"
    );

    // Categorize by due date
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const overdue = activeTasks.filter((t: { due_date: string | null }) => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < todayStart;
    });

    const today = activeTasks.filter((t: { due_date: string | null }) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d >= todayStart && d < todayEnd;
    });

    const thisWeek = activeTasks.filter((t: { due_date: string | null }) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d >= todayEnd && d < weekEnd;
    });

    return NextResponse.json({
      tasks: activeTasks,
      overdue,
      today,
      thisWeek,
      total: activeTasks.length,
    });
  } catch (err) {
    console.error("ClickUp fetch error:", err);
    return NextResponse.json({
      error: "Failed to fetch ClickUp tasks",
      tasks: [],
      overdue: [],
      today: [],
      thisWeek: [],
      total: 0,
    });
  }
}
