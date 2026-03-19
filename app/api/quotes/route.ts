import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get all quotes to rotate through
    const { data: quotes, error } = await supabase
      .from("daily_quotes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (!quotes || quotes.length === 0) {
      return NextResponse.json({
        quote_text: "Whatever you want in life, give it away first.",
        source_title: "Affirmations Of Truth",
        source_author: "Kevin Trudeau",
        category: "giving",
      });
    }

    // Rotate daily based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);
    const todayQuote = quotes[dayOfYear % quotes.length];

    return NextResponse.json(todayQuote);
  } catch (err) {
    console.error("Quote fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
