import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

interface BriefingResponse {
  available: boolean;
  date: string;
  source: string;
  actionItems: string[];
  followUps: string[];
  decisions: string[];
  unresolvedQuestions: string[];
  ideas: string[];
  narrative: string;
  title?: string;
  schedule?: unknown[];
  suggestions?: unknown[];
  insights?: unknown[];
  metadata?: Record<string, unknown>;
  message?: string;
}

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // Try to get the latest briefing from Supabase
    const { data: briefings, error } = await supabase
      .from("life_engine_briefings")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (briefings && briefings.length > 0) {
      const b = briefings[0];

      // Extract string arrays from JSONB fields for backward compatibility
      const actionItems = Array.isArray(b.action_items)
        ? b.action_items.map((item: string | { text: string }) =>
            typeof item === "string" ? item : item.text || JSON.stringify(item)
          )
        : [];

      const followUps = Array.isArray(b.follow_ups)
        ? b.follow_ups.map((item: string | { text: string }) =>
            typeof item === "string" ? item : item.text || JSON.stringify(item)
          )
        : [];

      const decisions = Array.isArray(b.decisions)
        ? b.decisions.map((item: string | { text: string }) =>
            typeof item === "string" ? item : item.text || JSON.stringify(item)
          )
        : [];

      const response: BriefingResponse = {
        available: true,
        date: b.briefing_date,
        source: "life-engine",
        actionItems,
        followUps,
        decisions,
        unresolvedQuestions: [],
        ideas: [],
        narrative: b.narrative || "",
        title: b.title,
        schedule: b.schedule || [],
        suggestions: b.suggestions || [],
        insights: b.insights || [],
        metadata: b.metadata || {},
      };

      return NextResponse.json(response);
    }

    // Fallback: try GitHub-based Limitless data (original approach)
    return fallbackToGitHub();
  } catch (err) {
    console.error("Briefing fetch error:", err);
    return fallbackToGitHub();
  }
}

async function fallbackToGitHub() {
  const githubToken = process.env.GITHUB_VAULT_TOKEN;

  if (!githubToken) {
    return NextResponse.json({
      available: false,
      date: "",
      source: "none",
      actionItems: [],
      followUps: [],
      decisions: [],
      unresolvedQuestions: [],
      ideas: [],
      narrative: "",
      message: "No briefing data — run /life-engine to generate",
    } as BriefingResponse);
  }

  try {
    for (let daysBack = 1; daysBack <= 7; daysBack++) {
      const d = new Date();
      d.setDate(d.getDate() - daysBack);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const monthName = d.toLocaleString("en-US", { month: "long" });
      const day = String(d.getDate()).padStart(2, "0");
      const monthFolder = `${year}-${month} ${monthName}`;
      const dateStr = `${year}-${month}-${day}`;

      const insightsPath = `limitless-life-log/${monthFolder}/${dateStr} - Daily Insights (Limitless).md`;
      const content = await fetchFromGitHub(githubToken, insightsPath);

      if (content) {
        const actionItems = parseSection(content, ["For You to Action"]);
        const followUps = parseSection(content, [
          "Key Follow-Ups",
          "Unresolved Questions",
        ]);
        const decisions = parseSection(content, ["Decisions Made"]);
        const unresolvedQuestions = parseSection(content, [
          "Unresolved Questions",
        ]);
        const ideas = parseSection(content, ["Seeds of an Idea"]);
        const narrative = parseNarrative(content);

        return NextResponse.json({
          available: true,
          date: dateStr,
          source: "daily-insights",
          actionItems: actionItems.slice(0, 6),
          followUps: followUps.slice(0, 4),
          decisions: decisions.slice(0, 4),
          unresolvedQuestions: unresolvedQuestions.slice(0, 3),
          ideas: ideas.slice(0, 3),
          narrative,
        } as BriefingResponse);
      }

      // Try analysis file as fallback
      const analysisPath = `limitless-life-log/${monthFolder}/${dateStr} - Daily Lifelog Analysis.md`;
      const analysisContent = await fetchFromGitHub(githubToken, analysisPath);
      if (analysisContent) {
        const actionItems = parseSection(analysisContent, [
          "Action Items",
          "Key Tasks",
          "Follow-Up Items",
          "Next Steps",
        ]);
        const followUps = parseSection(analysisContent, [
          "Follow-Up Items",
          "Next Steps",
        ]);

        return NextResponse.json({
          available: true,
          date: dateStr,
          source: "daily-analysis",
          actionItems: actionItems.slice(0, 6),
          followUps: followUps.slice(0, 4),
          decisions: [],
          unresolvedQuestions: [],
          ideas: [],
          narrative: "",
        } as BriefingResponse);
      }
    }

    return NextResponse.json({
      available: false,
      date: "",
      source: "none",
      actionItems: [],
      followUps: [],
      decisions: [],
      unresolvedQuestions: [],
      ideas: [],
      narrative: "",
      message: "No recent Limitless data found",
    } as BriefingResponse);
  } catch (err) {
    console.error("GitHub fallback error:", err);
    return NextResponse.json({
      available: false,
      date: "",
      source: "none",
      actionItems: [],
      followUps: [],
      decisions: [],
      unresolvedQuestions: [],
      ideas: [],
      narrative: "",
      message: "Error reading Limitless data",
    } as BriefingResponse);
  }
}

function parseSection(content: string, sectionHeaders: string[]): string[] {
  const items: string[] = [];
  for (const header of sectionHeaders) {
    const headerRegex = new RegExp(
      `(?:^|\\n)#+\\s*${header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n`,
      "i"
    );
    const match = content.match(headerRegex);
    if (!match || match.index === undefined) continue;
    const startIdx = match.index + match[0].length;
    const rest = content.slice(startIdx);
    const nextHeading = rest.match(/\n#{1,3}\s+[^\n]/);
    const sectionText =
      nextHeading && nextHeading.index !== undefined
        ? rest.slice(0, nextHeading.index)
        : rest.slice(0, 2000);
    for (const line of sectionText.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- **") || trimmed.startsWith("- ")) {
        let item = trimmed.replace(/^-\s*/, "").trim();
        item = item.replace(/\s*\*Source:.*?\*\s*$/, "").trim();
        if (item.length > 5) items.push(item);
      }
    }
  }
  return items;
}

function parseNarrative(content: string): string {
  const narrativeMatch = content.match(
    /## (?:.*?)Daily Narrative[^\n]*\n([\s\S]*?)(?=\n##|\n#[^#])/i
  );
  if (narrativeMatch) {
    const text = narrativeMatch[1].trim();
    const firstPara = text
      .split("\n\n")[0]
      .replace(/^#+.*\n/, "")
      .trim();
    if (firstPara.length > 10) return firstPara;
  }
  return "";
}

async function fetchFromGitHub(
  token: string,
  filePath: string
): Promise<string | null> {
  try {
    const url = `https://api.github.com/repos/dfrench222/obsidian-jumm-life/contents/${encodeURIComponent(filePath)}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}
