import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("priority", { ascending: true });

    if (error) throw error;

    return NextResponse.json(projects || []);
  } catch (err) {
    console.error("Projects fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
