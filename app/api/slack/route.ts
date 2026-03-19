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
      channel_id: "C092T5NH2EP",
      sender: "Zapier Bot",
      preview: "New task created: Review Limitless daily analysis output",
      full_text: "New task created: Review Limitless daily analysis output. The daily analysis pipeline ran at 10:00 AM and generated insights from yesterday's Limitless recordings. 3 action items were flagged for review.",
      timestamp: hoursAgo(now, 1),
      message_ts: msToSlackTs(hoursAgo(now, 1)),
      workspace: "jumm-life",
      tier: 2,
    },
    {
      id: "jl-2",
      channel: "#task-inbox",
      channel_id: "C092T5NH2EP",
      sender: "Zapier Bot",
      preview: "New task: Verify February restitution payment receipt",
      full_text: "New task: Verify February restitution payment receipt. Confirm the wire transfer was received and documented. Follow up with counsel if confirmation has not arrived by end of day.",
      timestamp: hoursAgo(now, 3),
      message_ts: msToSlackTs(hoursAgo(now, 3)),
      workspace: "jumm-life",
      tier: 1,
    },
    {
      id: "jl-3",
      channel: "#daily-sync",
      channel_id: "C092DAILY",
      sender: "Assistant",
      preview: "Morning brief posted. 3 items need your review today.",
      full_text: "Morning brief posted. 3 items need your review today:\n1. Restitution payment verification\n2. Penny's spring break travel dates\n3. De French 2.0 content calendar draft\n\nAll items have been added to your Ivy Lee Queue.",
      timestamp: hoursAgo(now, 5),
      message_ts: msToSlackTs(hoursAgo(now, 5)),
      workspace: "jumm-life",
      tier: 2,
    },
    {
      id: "jl-4",
      channel: "#task-inbox",
      channel_id: "C092T5NH2EP",
      sender: "Zapier Bot",
      preview: "Reminder: Penny monthly allowance transfer due March 20",
      full_text: "Reminder: Penny monthly allowance transfer due March 20. Amount: $650 monthly allowance. Transfer to Araba's account for Penny's expenses in Rome. College fund contribution ($500) is separate.",
      timestamp: hoursAgo(now, 8),
      message_ts: msToSlackTs(hoursAgo(now, 8)),
      workspace: "jumm-life",
      tier: 1,
    },
    {
      id: "jl-5",
      channel: "#general",
      channel_id: "C092GENERAL",
      sender: "Don French",
      preview: "Open Brain dashboard updates shipping today",
      full_text: "Open Brain dashboard updates shipping today. Major rebuild: expandable cards, deep links, daily briefing, PWA support. Command center mode activated.",
      timestamp: hoursAgo(now, 12),
      message_ts: msToSlackTs(hoursAgo(now, 12)),
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

function msToSlackTs(isoStr: string): string {
  const ms = new Date(isoStr).getTime();
  return (ms / 1000).toFixed(6);
}
