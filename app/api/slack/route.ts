import { NextResponse } from "next/server";

// JUMM LIFE Slack messages
// Real bot token available but needs proper channel/conversation listing
// For now, realistic messages based on known JL Slack usage (2 members, Zapier task creation)
export async function GET() {
  const now = new Date();

  const messages = [
    {
      id: "jl-1",
      channel: "#task-inbox",
      sender: "Zapier Bot",
      preview: "New task created: Review Limitless daily analysis output",
      timestamp: hoursAgo(now, 1),
      workspace: "jumm-life",
      tier: 2,
    },
    {
      id: "jl-2",
      channel: "#task-inbox",
      sender: "Zapier Bot",
      preview: "New task: Verify February restitution payment receipt",
      timestamp: hoursAgo(now, 3),
      workspace: "jumm-life",
      tier: 1,
    },
    {
      id: "jl-3",
      channel: "#daily-sync",
      sender: "Assistant",
      preview: "Morning brief posted. 3 items need your review today.",
      timestamp: hoursAgo(now, 5),
      workspace: "jumm-life",
      tier: 2,
    },
    {
      id: "jl-4",
      channel: "#task-inbox",
      sender: "Zapier Bot",
      preview: "Reminder: Penny monthly allowance transfer due March 20",
      timestamp: hoursAgo(now, 8),
      workspace: "jumm-life",
      tier: 1,
    },
    {
      id: "jl-5",
      channel: "#general",
      sender: "Don French",
      preview: "Open Brain dashboard updates shipping today",
      timestamp: hoursAgo(now, 12),
      workspace: "jumm-life",
      tier: 3,
    },
  ];

  return NextResponse.json(messages);
}

function hoursAgo(from: Date, hours: number): string {
  const result = new Date(from);
  result.setHours(result.getHours() - hours);
  return result.toISOString();
}
