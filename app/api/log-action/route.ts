import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, table_name, record_id, details } = body;

    if (!action) {
      return NextResponse.json({ error: "action required" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    await supabase.from("audit_log").insert({
      action,
      table_name: table_name || null,
      record_id: record_id || null,
      details: details || {},
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Log action error:", err);
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
