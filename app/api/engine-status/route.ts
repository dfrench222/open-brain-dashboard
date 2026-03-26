import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    const { data: cycles, error } = await supabase
      .from("engine_cycles")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    const lastCycle = cycles && cycles.length > 0 ? cycles[0] : null;

    // Calculate staleness
    let isStale = true;
    let minutesSinceSync = Infinity;

    if (lastCycle?.completed_at) {
      const completedAt = new Date(lastCycle.completed_at);
      minutesSinceSync = Math.round(
        (Date.now() - completedAt.getTime()) / 60000
      );
      isStale = minutesSinceSync > 60; // Stale if > 1 hour
    } else if (lastCycle?.started_at) {
      const startedAt = new Date(lastCycle.started_at);
      minutesSinceSync = Math.round(
        (Date.now() - startedAt.getTime()) / 60000
      );
      isStale = minutesSinceSync > 60;
    }

    return NextResponse.json({
      lastCycle: lastCycle
        ? {
            id: lastCycle.id,
            cycle_type: lastCycle.cycle_type,
            started_at: lastCycle.started_at,
            completed_at: lastCycle.completed_at,
            sources_synced: lastCycle.sources_synced || [],
            items_written: lastCycle.items_written || 0,
            errors: lastCycle.errors || [],
            metadata: lastCycle.metadata || {},
          }
        : null,
      isStale,
      minutesSinceSync:
        minutesSinceSync === Infinity ? null : minutesSinceSync,
    });
  } catch (err) {
    console.error("Engine status fetch error:", err);
    return NextResponse.json({
      lastCycle: null,
      isStale: true,
      minutesSinceSync: null,
      error: "Failed to fetch engine status",
    });
  }
}
