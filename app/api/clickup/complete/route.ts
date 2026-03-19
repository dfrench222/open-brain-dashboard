import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = process.env.CLICKUP_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "ClickUp API token not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    // Update task status to "Closed" in ClickUp
    const res = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Closed",
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("ClickUp API error:", errorData);
      return NextResponse.json(
        { error: `ClickUp API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, task: data });
  } catch (err) {
    console.error("ClickUp complete error:", err);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
