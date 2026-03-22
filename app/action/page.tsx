"use client";

import React, { useEffect, useState, useCallback } from "react";
import CommandBar from "@/components/CommandBar";
import IssuesBanner from "@/components/IssuesBanner";
import ActionList, { ActionItem } from "@/components/ActionList";
import ActionSuggestions, { Suggestion } from "@/components/ActionSuggestions";

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  list: string;
  url: string;
  updated: string | null;
}

interface NotionPage {
  id: string;
  title: string;
  status: string;
  url?: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function dueLabel(dateStr: string | null): string {
  if (!dateStr) return "";
  const due = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays}d`;
}

function generateSuggestions(tasks: ClickUpTask[]): Suggestion[] {
  const overdue = tasks.filter((t) => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date();
  });

  const suggestions: Suggestion[] = [];

  overdue.slice(0, 3).forEach((task) => {
    const daysBehind = Math.ceil(
      (Date.now() - new Date(task.due_date!).getTime()) / 86400000
    );
    suggestions.push({
      directive: `Complete "${task.name}"`,
      estimatedTime: daysBehind > 3 ? "30-45 min" : "15-30 min",
      reason: `This task is ${daysBehind} day${daysBehind !== 1 ? "s" : ""} overdue in ${task.list}. Getting it done now clears your plate and keeps momentum.`,
    });
  });

  // If we have fewer than 3, pad with general suggestions from active tasks
  const active = tasks.filter((t) => !overdue.includes(t)).slice(0, 5 - suggestions.length);
  active.forEach((task) => {
    suggestions.push({
      directive: `Work on "${task.name}"`,
      estimatedTime: "20-30 min",
      reason: `Active task in ${task.list}. Making progress here keeps your projects moving forward.`,
    });
  });

  return suggestions.slice(0, 5);
}

export default function ActionPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  const fetchData = useCallback(async () => {
    const items: ActionItem[] = [];
    const issuesList: string[] = [];
    const warningsList: string[] = [];
    let allTasks: ClickUpTask[] = [];

    // Fetch ClickUp tasks
    try {
      const cuRes = await fetch("/api/clickup");
      const cuData = await cuRes.json();

      if (cuData.error && cuData.total === 0) {
        warningsList.push("ClickUp: " + cuData.error);
      }

      allTasks = cuData.tasks || [];
      setTotalTasks(cuData.total || 0);

      const overdueTasks: ClickUpTask[] = cuData.overdue || [];
      setOverdueCount(overdueTasks.length);

      if (overdueTasks.length > 0) {
        issuesList.push(`${overdueTasks.length} overdue ClickUp task${overdueTasks.length !== 1 ? "s" : ""}`);
      }

      // Map all active tasks to action items
      (cuData.tasks || []).forEach((task: ClickUpTask) => {
        const isOverdue = task.due_date && new Date(task.due_date) < new Date();
        items.push({
          id: `cu-${task.id}`,
          type: isOverdue ? "REQ" : "TASK",
          description: task.name,
          timeAgo: task.due_date ? dueLabel(task.due_date) : timeAgo(task.updated),
          dueDate: task.due_date,
          source: `ClickUp / ${task.list}`,
          sourceType: "clickup",
          sourceId: task.id,
          sourceUrl: task.url,
        });
      });
    } catch {
      warningsList.push("Could not connect to ClickUp");
    }

    // Fetch Notion tasks
    try {
      const nRes = await fetch("/api/notion");
      const nData = await nRes.json();

      if (nData.has_data && nData.pages?.length > 0) {
        nData.pages.slice(0, 8).forEach((page: NotionPage) => {
          items.push({
            id: `notion-${page.id}`,
            type: page.status === "in-progress" ? "REQ" : "TASK",
            description: page.title,
            source: "Notion / JL",
            sourceType: "notion",
            sourceId: page.id,
            sourceUrl: page.url || `https://notion.so/${page.id.replace(/-/g, "")}`,
          });
        });
      }
    } catch {
      // Notion unavailable
    }

    // Sort: REQ first, then F/U, then TASK
    const typeOrder: Record<string, number> = { REQ: 0, "F/U": 1, TASK: 2 };
    items.sort((a, b) => (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2));

    setActionItems(items);
    setIssues(issuesList);
    setWarnings(warningsList);
    setSuggestions(generateSuggestions(allTasks));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleComplete = (item: ActionItem) => {
    setActionItems((prev) => prev.filter((i) => i.id !== item.id));
    setTotalTasks((prev) => Math.max(0, prev - 1));
  };

  return (
    <div>
      <CommandBar />

      {/* Issues/Warnings Banner */}
      <IssuesBanner issues={issues} warnings={warnings} />

      {/* ACTION REQUIRED */}
      <section className="mb-10">
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-5"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}
        >
          Action Required
          {overdueCount > 0 && (
            <span
              className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "var(--neon-red)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
              }}
            >
              {overdueCount} overdue
            </span>
          )}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl p-6"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
              >
                <div className="h-4 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-3 w-1/2 rounded mt-2" style={{ background: "rgba(255,255,255,0.03)" }} />
              </div>
            ))}
          </div>
        ) : (
          <ActionList items={actionItems} onComplete={handleComplete} />
        )}
      </section>

      {/* Key Metrics */}
      <section className="mb-10">
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-5"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}
        >
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <span className="kpi-label block mb-2">Restitution Balance</span>
            <span
              className="text-2xl font-bold block metric-value"
              style={{ color: "var(--neon-purple)", textShadow: "0 0 10px rgba(168,85,247,0.3)" }}
            >
              ~$8.4M
            </span>
            <span className="text-xs block mt-1" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
              Estimated -- verified
            </span>
          </div>
          <div className="glass-card p-5">
            <span className="kpi-label block mb-2">Penny Monthly</span>
            <span
              className="text-2xl font-bold block metric-value"
              style={{ color: "var(--neon-blue)", textShadow: "0 0 10px rgba(59,130,246,0.3)" }}
            >
              $10,596
            </span>
            <span className="text-xs block mt-1" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
              Support + Tuition + Fund
            </span>
          </div>
          <div className="glass-card p-5">
            <span className="kpi-label block mb-2">Waiting On You</span>
            <span
              className="text-2xl font-bold block metric-value"
              style={{ color: "var(--accent-warm)", textShadow: "0 0 10px rgba(253,51,0,0.3)" }}
            >
              {totalTasks}
            </span>
            <span className="text-xs block mt-1" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
              Total actionable tasks
            </span>
          </div>
        </div>
      </section>

      {/* What I Can Do Right Now */}
      {suggestions.length > 0 && (
        <section className="mb-10">
          <ActionSuggestions suggestions={suggestions} />
        </section>
      )}
    </div>
  );
}
