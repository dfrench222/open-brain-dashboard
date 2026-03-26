import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const { data: events, error } = await supabase
      .from("synced_calendar_events")
      .select("*")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    if (error) throw error;

    if (events && events.length > 0) {
      const formatted = events.map((e) => ({
        id: e.external_id,
        title: e.title,
        description: e.description || "",
        start_time: e.start_time,
        end_time: e.end_time,
        location: e.location || "",
        attendees: e.attendees || [],
        workspace: e.workspace,
        ai_prep_notes: e.ai_prep_notes || "",
      }));

      return NextResponse.json({
        events: formatted,
        connected: true,
      });
    }

    // No synced events — return empty with connect message
    return NextResponse.json({
      events: [],
      connected: false,
      message: "No synced events — run /life-engine to sync Google Calendar",
    });
  } catch (err) {
    console.error("Calendar fetch error:", err);
    return NextResponse.json({
      events: [],
      connected: false,
      message: "Error reading calendar data",
    });
  }
}
