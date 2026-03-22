import { NextResponse } from "next/server";

interface BriefingData {
  date: string;
  source: "daily-insights" | "daily-analysis" | "none";
  actionItems: string[];
  followUps: string[];
  decisions: string[];
  unresolvedQuestions: string[];
  ideas: string[];
  narrative: string;
  available: boolean;
  message?: string;
}

function getMonthFolder(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const monthName = d.toLocaleString("en-US", { month: "long" });
  return `${year}-${month} ${monthName}`;
}

function getDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseSection(content: string, sectionHeaders: string[]): string[] {
  const items: string[] = [];
  for (const header of sectionHeaders) {
    const headerRegex = new RegExp(`(?:^|\\n)#+\\s*${header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n`, "i");
    const match = content.match(headerRegex);
    if (!match || match.index === undefined) continue;
    const startIdx = match.index + match[0].length;
    const rest = content.slice(startIdx);
    const nextHeading = rest.match(/\n#{1,3}\s+[^\n]/);
    const sectionText = nextHeading && nextHeading.index !== undefined
      ? rest.slice(0, nextHeading.index)
      : rest.slice(0, 2000);
    const lines = sectionText.split("\n");
    for (const line of lines) {
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
  const narrativeMatch = content.match(/## (?:.*?)Daily Narrative[^\n]*\n([\s\S]*?)(?=\n##|\n#[^#])/i);
  if (narrativeMatch) {
    const text = narrativeMatch[1].trim();
    const firstPara = text.split("\n\n")[0].replace(/^#+.*\n/, "").trim();
    if (firstPara.length > 10) return firstPara;
  }
  return "";
}

async function fetchFromGitHub(token: string, filePath: string): Promise<string | null> {
  try {
    const url = `https://api.github.com/repos/dfrench222/obsidian-jumm-life/contents/${encodeURIComponent(filePath)}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.content) {
      // GitHub returns base64 encoded content
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
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
      message: "Set up GitHub token for daily briefing",
    } as BriefingData);
  }

  try {
    // Try yesterday first, then go back up to 7 days
    for (let daysBack = 1; daysBack <= 7; daysBack++) {
      const d = new Date();
      d.setDate(d.getDate() - daysBack);
      const monthFolder = getMonthFolder(d);
      const dateStr = getDateStr(d);

      // Try Daily Insights first
      const insightsPath = `limitless-life-log/${monthFolder}/${dateStr} - Daily Insights (Limitless).md`;
      const insightsContent = await fetchFromGitHub(githubToken, insightsPath);

      if (insightsContent) {
        const actionItems = parseSection(insightsContent, ["For You to Action"]);
        const followUps = parseSection(insightsContent, ["Key Follow-Ups", "Unresolved Questions"]);
        const decisions = parseSection(insightsContent, ["Decisions Made"]);
        const unresolvedQuestions = parseSection(insightsContent, ["Unresolved Questions"]);
        const ideas = parseSection(insightsContent, ["Seeds of an Idea"]);
        const narrative = parseNarrative(insightsContent);

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
        } as BriefingData);
      }

      // Try Daily Analysis as fallback
      const analysisPath = `limitless-life-log/${monthFolder}/${dateStr} - Daily Lifelog Analysis.md`;
      const analysisContent = await fetchFromGitHub(githubToken, analysisPath);

      if (analysisContent) {
        const actionItems = parseSection(analysisContent, [
          "Action Items", "Key Tasks", "Follow-Up Items", "Next Steps",
        ]);
        const followUps = parseSection(analysisContent, ["Follow-Up Items", "Next Steps"]);

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
        } as BriefingData);
      }
    }

    // No files found in last 7 days
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
    } as BriefingData);
  } catch (err) {
    console.error("Briefing fetch error:", err);
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
    } as BriefingData);
  }
}
