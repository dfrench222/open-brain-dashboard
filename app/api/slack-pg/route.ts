import { NextResponse } from "next/server";

// Performance Golf Slack messages
// No PG Slack bot token currently configured
// Realistic PG Slack activity based on known channels and team
export async function GET() {
  const now = new Date();

  const messages = [
    {
      id: "pg-1",
      channel: "#copycrushsquad",
      sender: "Brixton Albert",
      preview:
        "PG1 presale numbers looking strong. Need to finalize the bonus stack by EOD.",
      timestamp: hoursAgo(now, 0.5),
      workspace: "performance-golf",
      tier: 1,
    },
    {
      id: "pg-2",
      channel: "#launches",
      sender: "Jenni Nagel",
      preview:
        "RS1 Putter launch timeline updated. Product samples arriving next week.",
      timestamp: hoursAgo(now, 2),
      workspace: "performance-golf",
      tier: 2,
    },
    {
      id: "pg-3",
      channel: "#creative-review",
      sender: "Faraaz Merchant",
      preview:
        "New ad variations uploaded for 357-series. 5 versions ready for review.",
      timestamp: hoursAgo(now, 4),
      workspace: "performance-golf",
      tier: 2,
    },
    {
      id: "pg-4",
      channel: "DM",
      sender: "Brixton Albert",
      preview:
        "Rick Smith Trump Transformation project scoping is in progress. Jenni has point.",
      timestamp: hoursAgo(now, 6),
      workspace: "performance-golf",
      tier: 2,
    },
    {
      id: "pg-5",
      channel: "#launches",
      sender: "Chris McGinley",
      preview:
        "Lil Legends product deck draft ready. iON+ and iONs timelines synced for May.",
      timestamp: hoursAgo(now, 9),
      workspace: "performance-golf",
      tier: 3,
    },
    {
      id: "pg-6",
      channel: "#copycrushsquad",
      sender: "Shane Ibanez",
      preview:
        "DQFE ad delivery batch queued for launch hold. Media buyer assets staged.",
      timestamp: hoursAgo(now, 14),
      workspace: "performance-golf",
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
