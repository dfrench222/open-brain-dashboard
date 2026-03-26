import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const { data: messages, error } = await supabase
      .from("synced_messages")
      .select("*")
      .eq("source", "slack_pg")
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
        workspace: m.workspace || "performance-golf",
        tier: m.tier || 3,
      }));

      return NextResponse.json(formatted);
    }

    // Fallback: return empty array (no hardcoded fake data)
    // The Life Engine skill will populate this via /life-engine sync cycles
    return NextResponse.json([]);
  } catch (err) {
    console.error("Slack PG fetch error:", err);
    return NextResponse.json([]);
  }
}
