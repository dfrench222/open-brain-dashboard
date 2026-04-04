import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // Get tier-1 messages from the last 48 hours
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 48);

    const { data, error } = await supabase
      .from("synced_messages")
      .select("*")
      .eq("tier", 1)
      .gte("timestamp", cutoff.toISOString())
      .order("timestamp", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      messages: data || [],
      count: data?.length || 0,
    });
  } catch (err) {
    console.error("Slack tier-1 fetch error:", err);
    return NextResponse.json({ messages: [], count: 0 });
  }
}
