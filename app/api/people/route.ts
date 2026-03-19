import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: people, error } = await supabase
      .from("people")
      .select("*")
      .order("interaction_count", { ascending: false });

    if (error) throw error;

    return NextResponse.json(people || []);
  } catch (err) {
    console.error("People fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch people" },
      { status: 500 }
    );
  }
}
