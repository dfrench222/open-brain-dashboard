import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const LIFELOG_BASE = "/Users/donfrench/jumm-life/limitless-life-log";

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

function findMostRecentFile(pattern: "Daily Insights" | "Daily Lifelog Analysis", maxDaysBack: number = 7): { filePath: string; date: Date } | null {
  const now = new Date();
  for (let i = 1; i <= maxDaysBack; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const monthFolder = getMonthFolder(d);
    const dateStr = getDateStr(d);

    let fileName: string;
    if (pattern === "Daily Insights") {
      fileName = `${dateStr} - Daily Insights (Limitless).md`;
    } else {
      fileName = `${dateStr} - Daily Lifelog Analysis.md`;
    }

    const filePath = path.join(LIFELOG_BASE, monthFolder, fileName);
    if (fs.existsSync(filePath)) {
      return { filePath, date: d };
    }
  }
  return null;
}

function parseSection(content: string, sectionHeaders: string[]): string[] {
  const items: string[] = [];

  for (const header of sectionHeaders) {
    const headerRegex = new RegExp(`(?:^|\\n)#+\\s*${header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n`, "i");
    const match = content.match(headerRegex);
    if (!match || match.index === undefined) continue;

    const startIdx = match.index + match[0].length;
    // Find the next heading
    const rest = content.slice(startIdx);
    const nextHeading = rest.match(/\n#{1,3}\s+[^\n]/);
    const sectionText = nextHeading && nextHeading.index !== undefined
      ? rest.slice(0, nextHeading.index)
      : rest.slice(0, 2000);

    // Extract bullet points
    const lines = sectionText.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- **") || trimmed.startsWith("- ")) {
        // Clean up markdown bold and source references
        let item = trimmed.replace(/^-\s*/, "").trim();
        // Remove *Source: ...* at the end
        item = item.replace(/\s*\*Source:.*?\*\s*$/, "").trim();
        if (item.length > 5) {
          items.push(item);
        }
      }
    }
  }

  return items;
}

function parseNarrative(content: string): string {
  // Look for the "Daily Narrative & Highlights" section
  const narrativeMatch = content.match(/## (?:.*?)Daily Narrative[^\n]*\n([\s\S]*?)(?=\n##|\n#[^#])/i);
  if (narrativeMatch) {
    // Get the first paragraph (skip any heading line)
    const text = narrativeMatch[1].trim();
    const firstPara = text.split("\n\n")[0].replace(/^#+.*\n/, "").trim();
    if (firstPara.length > 10) return firstPara;
  }
  return "";
}

export async function GET() {
  try {
    // Check if the lifelog directory exists (local only)
    if (!fs.existsSync(LIFELOG_BASE)) {
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
        message: "Connect local Limitless sync for daily briefing",
      } as BriefingData & { message: string });
    }

    // Try to find the most recent Daily Insights file
    const insightsFile = findMostRecentFile("Daily Insights");
    const analysisFile = findMostRecentFile("Daily Lifelog Analysis");

    if (!insightsFile && !analysisFile) {
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
      } as BriefingData & { message: string });
    }

    let actionItems: string[] = [];
    let followUps: string[] = [];
    let decisions: string[] = [];
    let unresolvedQuestions: string[] = [];
    let ideas: string[] = [];
    let narrative = "";
    let sourceDate = "";
    let source: "daily-insights" | "daily-analysis" = "daily-insights";

    // Parse Daily Insights (primary source)
    if (insightsFile) {
      const content = fs.readFileSync(insightsFile.filePath, "utf-8");
      sourceDate = getDateStr(insightsFile.date);

      actionItems = parseSection(content, ["For You to Action"]);
      followUps = parseSection(content, ["Key Follow-Ups", "Unresolved Questions"]);
      decisions = parseSection(content, ["Decisions Made"]);
      unresolvedQuestions = parseSection(content, ["Unresolved Questions"]);
      ideas = parseSection(content, ["Seeds of an Idea"]);
      narrative = parseNarrative(content);
      source = "daily-insights";
    }

    // If we also have an analysis file, supplement action items
    if (analysisFile && actionItems.length === 0) {
      const content = fs.readFileSync(analysisFile.filePath, "utf-8");
      if (!sourceDate) {
        sourceDate = getDateStr(analysisFile.date);
        source = "daily-analysis";
      }

      // Try to extract action items from analysis format
      const analysisActions = parseSection(content, [
        "Action Items",
        "Key Tasks",
        "Follow-Up Items",
        "Next Steps",
      ]);
      if (analysisActions.length > 0) {
        actionItems = [...actionItems, ...analysisActions];
      }
    }

    return NextResponse.json({
      available: true,
      date: sourceDate,
      source,
      actionItems: actionItems.slice(0, 6),
      followUps: followUps.slice(0, 4),
      decisions: decisions.slice(0, 4),
      unresolvedQuestions: unresolvedQuestions.slice(0, 3),
      ideas: ideas.slice(0, 3),
      narrative,
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
    } as BriefingData & { message: string });
  }
}
