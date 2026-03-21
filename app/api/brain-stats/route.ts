import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Query real counts from Supabase tables in parallel
    const [thoughtsRes, peopleRes, projectsRes, quotesRes] = await Promise.all([
      supabase.from("thoughts").select("*", { count: "exact", head: true }),
      supabase.from("people").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("daily_quotes").select("*", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      thoughts: thoughtsRes.count ?? null,
      people: peopleRes.count ?? null,
      projects: projectsRes.count ?? null,
      quotes: quotesRes.count ?? null,
      errors: {
        thoughts: thoughtsRes.error?.message ?? null,
        people: peopleRes.error?.message ?? null,
        projects: projectsRes.error?.message ?? null,
        quotes: quotesRes.error?.message ?? null,
      },
    });
  } catch (err) {
    console.error("Brain stats fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch brain stats" },
      { status: 500 }
    );
  }
}
