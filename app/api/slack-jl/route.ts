import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const { data: messages, error } = await supabase
      .from("synced_messages")
      .select("*")
      .eq("source", "slack_jl")
      .order("timestamp", { ascending: false })
      .limit(20);

    if (error) throw error;

    // If we have synced data, return it in the expected shape
    if (messages && messages.length > 0) {
      const formatted = messages.map((m) => ({
        id: m.external_id,
        channel: m.channel_name || "Unknown",
        channel_id: m.channel_id || "",
        sender: m.sender_name || "Unknown",
        preview: m.preview || "",
        full_text: m.full_text || "",
        timestamp: m.timestamp,
        message_ts: m.timestamp
          ? (new Date(m.timestamp).getTime() / 1000).toFixed(6)
          : "0",
        workspace: m.workspace || "jumm-life",
        tier: m.tier || 3,
      }));

      return NextResponse.json(formatted);
    }

    // Fallback: if no synced data, try Slack API directly
    return fallbackToSlackApi();
  } catch (err) {
    console.error("Slack JL fetch error:", err);
    return fallbackToSlackApi();
  }
}

async function fallbackToSlackApi() {
  const token = process.env.SLACK_JL_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({
      messages: [],
      error: "Slack JL bot token not configured",
    });
  }

  try {
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

    const channels = (channelsData.channels || []).filter(
      (c: { is_member: boolean }) => c.is_member
    );

    if (channels.length === 0) {
      return NextResponse.json([]);
    }

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

    const userCache: Record<string, string> = {};

    for (const channel of channels.slice(0, 8)) {
      try {
        const histRes = await fetch(
          `https://slack.com/api/conversations.history?channel=${channel.id}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const histData = await histRes.json();
        if (!histData.ok) continue;

        for (const msg of histData.messages || []) {
          let sender = msg.username || "Unknown";
          if (msg.user && !userCache[msg.user]) {
            try {
              const userRes = await fetch(
                `https://slack.com/api/users.info?user=${msg.user}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const userData = await userRes.json();
              if (userData.ok && userData.user) {
                userCache[msg.user] =
                  userData.user.profile?.display_name ||
                  userData.user.real_name ||
                  userData.user.name ||
                  "Unknown";
              }
            } catch { /* keep Unknown */ }
          }
          if (msg.user && userCache[msg.user]) sender = userCache[msg.user];
          if (msg.bot_id && !msg.username) sender = "Bot";

          const text = msg.text || "";
          const preview = text.length > 120 ? text.slice(0, 120) + "..." : text;
          const timestamp = new Date(parseFloat(msg.ts) * 1000).toISOString();
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
      } catch { /* skip channel */ }
    }

    allMessages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(allMessages.slice(0, 15));
  } catch (err) {
    console.error("Slack JL fallback error:", err);
    return NextResponse.json({
      messages: [],
      error: "Failed to fetch Slack messages",
    });
  }
}
