import { NextResponse } from "next/server";

interface SlackChannel {
  id: string;
  name: string;
  is_member: boolean;
}

interface SlackMessage {
  ts: string;
  text: string;
  user?: string;
  bot_id?: string;
  username?: string;
}

interface SlackUser {
  id: string;
  real_name?: string;
  name?: string;
  profile?: { display_name?: string; real_name?: string };
}

export async function GET() {
  const token = process.env.SLACK_JL_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({
      messages: [],
      error: "Slack JL bot token not configured",
    });
  }

  try {
    // Step 1: Get channels the bot is in
    const channelsRes = await fetch(
      "https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=50",
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      }
    );
    const channelsData = await channelsRes.json();

    if (!channelsData.ok) {
      throw new Error(`Slack API error: ${channelsData.error}`);
    }

    const channels: SlackChannel[] = (channelsData.channels || []).filter(
      (c: SlackChannel) => c.is_member
    );

    if (channels.length === 0) {
      return NextResponse.json({ messages: [], channels: [] });
    }

    // Step 2: Fetch recent messages from each channel
    const allMessages: {
      id: string;
      channel: string;
      channel_id: string;
      sender: string;
      preview: string;
      full_text: string;
      timestamp: string;
      message_ts: string;
      workspace: string;
      tier: number;
    }[] = [];

    // Cache user lookups
    const userCache: Record<string, string> = {};

    for (const channel of channels.slice(0, 8)) {
      try {
        const histRes = await fetch(
          `https://slack.com/api/conversations.history?channel=${channel.id}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const histData = await histRes.json();

        if (!histData.ok) continue;

        for (const msg of (histData.messages || []) as SlackMessage[]) {
          // Resolve user name
          let sender = msg.username || "Unknown";
          if (msg.user && !userCache[msg.user]) {
            try {
              const userRes = await fetch(
                `https://slack.com/api/users.info?user=${msg.user}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const userData = await userRes.json();
              if (userData.ok && userData.user) {
                const u = userData.user as SlackUser;
                userCache[msg.user] = u.profile?.display_name || u.real_name || u.name || "Unknown";
              }
            } catch {
              // keep "Unknown"
            }
          }
          if (msg.user && userCache[msg.user]) {
            sender = userCache[msg.user];
          }
          if (msg.bot_id && !msg.username) {
            sender = "Bot";
          }

          const text = msg.text || "";
          const preview = text.length > 120 ? text.slice(0, 120) + "..." : text;
          const timestamp = new Date(parseFloat(msg.ts) * 1000).toISOString();

          // Simple tier: recent = higher tier
          const ageHours = (Date.now() - parseFloat(msg.ts) * 1000) / 3600000;
          const tier = ageHours < 2 ? 1 : ageHours < 8 ? 2 : 3;

          allMessages.push({
            id: `jl-${channel.id}-${msg.ts}`,
            channel: `#${channel.name}`,
            channel_id: channel.id,
            sender,
            preview,
            full_text: text,
            timestamp,
            message_ts: msg.ts,
            workspace: "jumm-life",
            tier,
          });
        }
      } catch {
        // Skip channel on error
      }
    }

    // Sort by timestamp descending
    allMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(allMessages.slice(0, 15));
  } catch (err) {
    console.error("Slack JL fetch error:", err);
    return NextResponse.json({ messages: [], error: "Failed to fetch Slack messages" });
  }
}
