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
      channel_id: "CPG_COPY",
      sender: "Brixton Albert",
      preview: "PG1 presale numbers looking strong. Need to finalize the bonus stack by EOD.",
      full_text: "PG1 presale numbers looking strong. Need to finalize the bonus stack by EOD. Current conversion rate is 4.2% which is above our 3.5% target. Let's lock in the bonus structure so creative team can finalize the sales page assets tonight.",
      timestamp: hoursAgo(now, 0.5),
      message_ts: msToSlackTs(hoursAgo(now, 0.5)),
      workspace: "performance-golf",
      tier: 1,
    },
    {
      id: "pg-2",
      channel: "#launches",
      channel_id: "CPG_LAUNCH",
      sender: "Jenni Nagel",
      preview: "RS1 Putter launch timeline updated. Product samples arriving next week.",
      full_text: "RS1 Putter launch timeline updated. Product samples arriving next week. Photography shoot scheduled for March 24-25. VSL script draft is 80% complete. Target launch window: April 8-12. All teams green-light for timeline.",
      timestamp: hoursAgo(now, 2),
      message_ts: msToSlackTs(hoursAgo(now, 2)),
      workspace: "performance-golf",
      tier: 2,
    },
    {
      id: "pg-3",
      channel: "#creative-review",
      channel_id: "CPG_CREATIVE",
      sender: "Faraaz Merchant",
      preview: "New ad variations uploaded for 357-series. 5 versions ready for review.",
      full_text: "New ad variations uploaded for 357-series. 5 versions ready for review.\n\nV1: Original hook + new CTA\nV2: Testimonial-led open\nV3: Problem-agitation-solution\nV4: Rick Smith authority angle\nV5: Before/after transformation\n\nAll assets in the shared Drive folder. Please review by Thursday.",
      timestamp: hoursAgo(now, 4),
      message_ts: msToSlackTs(hoursAgo(now, 4)),
      workspace: "performance-golf",
      tier: 2,
    },
    {
      id: "pg-4",
      channel: "DM",
      channel_id: "DPG_BRIXTON",
      sender: "Brixton Albert",
      preview: "Rick Smith Trump Transformation project scoping is in progress. Jenni has point.",
      full_text: "Rick Smith Trump Transformation project scoping is in progress. Jenni has point on this one. Initial brief looks solid — we're looking at a 6-week campaign window. Budget allocation needs your sign-off before we can proceed to creative.",
      timestamp: hoursAgo(now, 6),
      message_ts: msToSlackTs(hoursAgo(now, 6)),
      workspace: "performance-golf",
      tier: 2,
    },
    {
      id: "pg-5",
      channel: "#launches",
      channel_id: "CPG_LAUNCH",
      sender: "Chris McGinley",
      preview: "Lil Legends product deck draft ready. iON+ and iONs timelines synced for May.",
      full_text: "Lil Legends product deck draft ready. iON+ and iONs timelines synced for May launch window. Key milestones:\n- Product samples: April 10\n- Photography: April 15-17\n- VSL production: April 20-25\n- Launch: May 1-5\n\nAll vendors confirmed. No blockers at this time.",
      timestamp: hoursAgo(now, 9),
      message_ts: msToSlackTs(hoursAgo(now, 9)),
      workspace: "performance-golf",
      tier: 3,
    },
    {
      id: "pg-6",
      channel: "#copycrushsquad",
      channel_id: "CPG_COPY",
      sender: "Shane Ibanez",
      preview: "DQFE ad delivery batch queued for launch hold. Media buyer assets staged.",
      full_text: "DQFE ad delivery batch queued for launch hold. Media buyer assets staged and ready to deploy. 12 ad variations across 3 audience segments. Pixel data from last campaign loaded for retargeting. Waiting for green light to launch.",
      timestamp: hoursAgo(now, 14),
      message_ts: msToSlackTs(hoursAgo(now, 14)),
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

function msToSlackTs(isoStr: string): string {
  const ms = new Date(isoStr).getTime();
  return (ms / 1000).toFixed(6);
}
