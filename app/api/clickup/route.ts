import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const { data: tasks, error } = await supabase
      .from("synced_tasks")
      .select("*")
      .eq("source", "clickup")
      .eq("is_active", true)
      .order("due_date", { ascending: true, nullsFirst: false });

    if (error) throw error;

    // Transform from synced_tasks schema to the response shape the frontend expects
    const formatted = (tasks || []).map((t) => ({
      id: t.external_id,
      name: t.title,
      status: t.status || "Unknown",
      status_color: t.raw_data?.status?.color || "#87909e",
      priority: t.priority || "none",
      due_date: t.due_date,
      assignees: t.assignees || [],
      list: t.list_name || "Unknown",
      updated: t.updated_at,
      workspace: t.workspace,
      url: t.external_url || `https://app.clickup.com/t/${t.external_id}`,
    }));

    // Categorize by due date
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const overdue = formatted.filter((t) => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < todayStart;
    });

    const today = formatted.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d >= todayStart && d < todayEnd;
    });

    const thisWeek = formatted.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return d >= todayEnd && d < weekEnd;
    });

    return NextResponse.json({
      tasks: formatted,
      overdue,
      today,
      thisWeek,
      total: formatted.length,
    });
  } catch (err) {
    console.error("ClickUp fetch error:", err);

    // Fallback: if Supabase has no data yet, try the ClickUp API directly
    return fallbackToClickUpApi();
  }
}

async function fallbackToClickUpApi() {
  const token = process.env.CLICKUP_API_TOKEN;
  const teamId = process.env.CLICKUP_TEAM_ID || "9014714949";

  if (!token) {
    return NextResponse.json({
      error: "No synced tasks and no ClickUp API token configured",
      tasks: [],
      overdue: [],
      today: [],
      thisWeek: [],
      total: 0,
    });
  }

  try {
    // Get Don's user ID
    let donUserId: number | null = null;
    try {
      const membersRes = await fetch(
        `https://api.clickup.com/api/v2/team/${teamId}/member`,
        { headers: { Authorization: token } }
      );
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        const don = (membersData.members || []).find(
          (m: { user: { username: string; email: string } }) =>
            m.user.username?.toLowerCase().includes("donnie") ||
            m.user.email?.toLowerCase() === "donnie@performancegolfzone.com" ||
            m.user.email?.toLowerCase() === "donnie@jummlife.com"
        );
        donUserId = don?.user.id ?? null;
      }
    } catch { /* continue without filter */ }

    let taskUrl = `https://api.clickup.com/api/v2/team/${teamId}/task?page=0&order_by=due_date&reverse=true&limit=50`;
    if (donUserId) {
      taskUrl += `&assignees[]=${donUserId}`;
    }

    const res = await fetch(taskUrl, {
      headers: { Authorization: token },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`ClickUp API returned ${res.status}`);

    const data = await res.json();
    const tasks = (data.tasks || [])
      .filter((t: { status: { status: string } }) =>
        t.status?.status?.toLowerCase() !== "closed" &&
        t.status?.status?.toLowerCase() !== "hold for launch"
      )
      .map((t: { id: string; name: string; status: { status: string; color: string }; priority: { priority: string } | null; due_date: string | null; assignees: { username: string; initials: string }[]; list: { name: string }; date_updated: string }) => ({
        id: t.id,
        name: t.name,
        status: t.status?.status || "Unknown",
        status_color: t.status?.color || "#87909e",
        priority: t.priority?.priority || "none",
        due_date: t.due_date ? new Date(parseInt(t.due_date)).toISOString() : null,
        assignees: (t.assignees || []).map((a) => ({ name: a.username, initials: a.initials })),
        list: t.list?.name || "Unknown",
        updated: t.date_updated ? new Date(parseInt(t.date_updated)).toISOString() : null,
        workspace: "performance-golf",
        url: `https://app.clickup.com/t/${t.id}`,
      }));

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return NextResponse.json({
      tasks,
      overdue: tasks.filter((t: { due_date: string | null }) => t.due_date && new Date(t.due_date) < todayStart),
      today: tasks.filter((t: { due_date: string | null }) => t.due_date && new Date(t.due_date) >= todayStart && new Date(t.due_date) < todayEnd),
      thisWeek: tasks.filter((t: { due_date: string | null }) => t.due_date && new Date(t.due_date) >= todayEnd && new Date(t.due_date) < weekEnd),
      total: tasks.length,
    });
  } catch (err) {
    console.error("ClickUp fallback error:", err);
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
