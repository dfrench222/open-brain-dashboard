"use client";

import React, { useState, useEffect } from "react";

interface Notification {
  id: string;
  tier: 1 | 2 | 3;
  message: string;
  description?: string;
  source: string;
  source_type?: "clickup" | "notion" | "static";
  source_id?: string;
  source_url?: string;
  due_date?: string | null;
}

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  list: string;
  assignees: { name: string }[];
}

interface NotionPage {
  id: string;
  title: string;
  status?: string;
  url?: string;
}

const tierConfig = {
  1: { color: "var(--neon-red)", bg: "rgba(239,68,68,0.08)", label: "NEEDS ATTENTION", icon: "!!" },
  2: { color: "var(--neon-amber)", bg: "rgba(245,158,11,0.08)", label: "CHECK LATER", icon: "!" },
  3: { color: "var(--text-muted)", bg: "rgba(71,85,105,0.06)", label: "WHEN FREE", icon: "~" },
};

function classifyClickUpTask(task: ClickUpTask): 1 | 2 | 3 {
  const now = Date.now();
  const due = task.due_date ? new Date(task.due_date).getTime() : null;
  if (due && due < now) return 1;
  if (task.status === "in progress") return 1;
  if (due && due < now + 7 * 86400000) return 2;
  if (task.status === "ready") return 2;
  return 3;
}

function classifyNotionPage(page: NotionPage): 1 | 2 | 3 {
  if (page.status === "in-progress") return 1;
  if (page.status === "pending") return 2;
  return 3;
}

function formatDueDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays}d`;
}

const fallbackNotifications: Notification[] = [
  { id: "f1", tier: 1, message: "Restitution payment due March 25", description: "Monthly restitution payment needs to be submitted. Verify payment details and confirm with counsel.", source: "Finance", source_type: "static" },
  { id: "f2", tier: 1, message: "PG Q1 revenue review — schedule with Brixton", description: "Schedule the Q1 revenue review meeting with Brixton. Prepare PG financials summary and growth metrics for discussion.", source: "Performance Golf", source_type: "static" },
  { id: "f3", tier: 2, message: "Penny spring break schedule — confirm dates with Araba", description: "Confirm travel dates and logistics for Penny's spring break. Coordinate with Araba on pickup/dropoff in Rome.", source: "Family", source_type: "static" },
  { id: "f4", tier: 2, message: "De French 2.0 content calendar review", description: "Review and finalize the content calendar for the De French 2.0 personal brand initiative.", source: "Projects", source_type: "static" },
  { id: "f5", tier: 3, message: "Update knowledge base distillation pipeline", description: "Optimize the Second Brain OS distillation pipeline for better daily insight routing.", source: "Second Brain", source_type: "static" },
  { id: "f6", tier: 3, message: "Freedom Factor project kickoff planning", description: "Begin scoping the Freedom Factor prison reform initiative. Outline initial goals and potential partners.", source: "Projects", source_type: "static" },
];

export default function NotificationBar() {
  const [expanded, setExpanded] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(fallbackNotifications);
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());

  // Load snoozed items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("open-brain-snoozed");
      if (stored) setSnoozedIds(new Set(JSON.parse(stored)));
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = (id: string) => setExpandedItemId((prev) => (prev === id ? null : id));

  const handleComplete = async (notification: Notification) => {
    if (notification.source_type !== "clickup" || !notification.source_id) return;
    setCompletingIds((prev) => new Set(prev).add(notification.id));
    try {
      const res = await fetch("/api/clickup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: notification.source_id }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }
    } catch {
      // Failed to complete
    } finally {
      setCompletingIds((prev) => {
        const next = new Set(prev);
        next.delete(notification.id);
        return next;
      });
    }
  };

  const handleSnooze = (notification: Notification) => {
    const newSnoozed = new Set(snoozedIds).add(notification.id);
    setSnoozedIds(newSnoozed);
    localStorage.setItem("open-brain-snoozed", JSON.stringify([...newSnoozed]));
  };

  useEffect(() => {
    const fetchAll = async () => {
      const items: Notification[] = [];

      // Fetch ClickUp tasks (PG)
      try {
        const cuRes = await fetch("/api/clickup");
        const cuData = await cuRes.json();
        if (cuData.tasks && cuData.tasks.length > 0) {
          cuData.tasks
            .filter((t: ClickUpTask) => t.status !== "hold for launch" && t.status !== "Closed")
            .slice(0, 10)
            .forEach((task: ClickUpTask) => {
              items.push({
                id: `cu-${task.id}`,
                tier: classifyClickUpTask(task),
                message: task.name,
                description: `${task.list ? `List: ${task.list}` : ""}${task.assignees?.length ? ` | Assigned: ${task.assignees.map((a) => a.name).join(", ")}` : ""}${task.status ? ` | Status: ${task.status}` : ""}`,
                source: "ClickUp / PG",
                source_type: "clickup",
                source_id: task.id,
                source_url: `https://app.clickup.com/t/${task.id}`,
                due_date: task.due_date,
              });
            });
        }
      } catch {
        // ClickUp unavailable
      }

      // Fetch Notion pages (JL)
      try {
        const nRes = await fetch("/api/notion");
        const nData = await nRes.json();
        if (nData.pages && nData.pages.length > 0) {
          nData.pages.slice(0, 6).forEach((page: NotionPage) => {
            items.push({
              id: `notion-${page.id}`,
              tier: classifyNotionPage(page),
              message: page.title,
              description: page.status ? `Status: ${page.status}` : "Notion page",
              source: "Notion / JL",
              source_type: "notion",
              source_id: page.id,
              source_url: page.url || `https://notion.so/${page.id.replace(/-/g, "")}`,
            });
          });
        }
      } catch {
        // Notion unavailable
      }

      // Always include key standing items
      items.push(
        {
          id: "static-1", tier: 1, message: "Restitution payment due March 25",
          description: "Monthly restitution payment needs to be submitted. Verify payment details and confirm with counsel.",
          source: "Finance", source_type: "static",
        },
        {
          id: "static-2", tier: 2, message: "Penny spring break schedule — confirm dates with Araba",
          description: "Confirm travel dates and logistics for Penny's spring break. Coordinate with Araba on pickup/dropoff in Rome.",
          source: "Family", source_type: "static",
        },
      );

      items.sort((a, b) => a.tier - b.tier);

      if (items.length > 0) {
        setNotifications(items);
      }
    };

    fetchAll();
  }, []);

  // Apply snooze: move snoozed Tier 1 items to Tier 2
  const processedNotifications = notifications.map((n) => {
    if (snoozedIds.has(n.id) && n.tier === 1) {
      return { ...n, tier: 2 as const };
    }
    return n;
  });

  const tier1Count = processedNotifications.filter((n) => n.tier === 1).length;
  const tier2Count = processedNotifications.filter((n) => n.tier === 2).length;
  const tier3Count = processedNotifications.filter((n) => n.tier === 3).length;

  const visibleNotifications = expanded
    ? processedNotifications
    : processedNotifications.filter((n) => n.tier === 1);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "150ms", opacity: 0 }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Summary bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(17,17,24,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--text-secondary)", fontSize: "0.7rem" }}
            >
              Ivy Lee Queue
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--neon-red)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--neon-red)", boxShadow: "0 0 8px var(--neon-red)" }} />
                {tier1Count}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--neon-amber)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--neon-amber)", boxShadow: "0 0 8px var(--neon-amber)" }} />
                {tier2Count}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--text-muted)" }} />
                {tier3Count}
              </span>
            </div>
          </div>
          <span
            className="text-xs transition-transform duration-200"
            style={{
              color: "var(--text-muted)",
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            &#x25BC;
          </span>
        </button>

        {/* Notification items */}
        {visibleNotifications.length > 0 && (
          <div className="mt-4 space-y-3">
            {visibleNotifications.map((notification, i) => {
              const config = tierConfig[notification.tier];
              const isItemExpanded = expandedItemId === notification.id;
              const isCompleting = completingIds.has(notification.id);

              return (
                <div
                  key={notification.id}
                  className="rounded-xl transition-all duration-200 animate-slide-in-left cursor-pointer"
                  style={{
                    background: isItemExpanded ? `${config.bg.replace("0.08", "0.12").replace("0.06", "0.1")}` : config.bg,
                    border: `1px solid ${config.color}15`,
                    borderBottom: `1px solid ${config.color}25`,
                    animationDelay: `${i * 50}ms`,
                    opacity: 0,
                  }}
                  onClick={() => toggleItem(notification.id)}
                >
                  {/* Collapsed row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        background: config.color,
                        boxShadow: notification.tier === 1 ? `0 0 8px ${config.color}` : "none",
                      }}
                    />
                    <span className="text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text-primary)" }}>
                      {notification.message}
                    </span>
                    <span
                      className="text-xs shrink-0 px-2 py-0.5 rounded"
                      style={{
                        color: config.color,
                        background: `${config.color}10`,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.55rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {notification.source}
                    </span>
                    {notification.due_date && (
                      <span
                        className="text-xs shrink-0"
                        style={{
                          color: "var(--text-muted)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.55rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDueDate(notification.due_date)}
                      </span>
                    )}
                    <span
                      className="text-xs shrink-0 transition-transform duration-200"
                      style={{
                        color: "var(--text-muted)",
                        transform: isItemExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      &#9656;
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isItemExpanded && (
                    <div
                      className="px-5 pb-4 pt-0"
                      style={{ borderTop: `1px solid ${config.color}10` }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="pt-3">
                        {notification.description && (
                          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                            {notification.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Complete button (ClickUp only) */}
                          {notification.source_type === "clickup" && notification.source_id && (
                            <button
                              onClick={() => handleComplete(notification)}
                              disabled={isCompleting}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                              style={{
                                color: "var(--neon-green)",
                                background: "rgba(34,197,94,0.08)",
                                border: "1px solid rgba(34,197,94,0.15)",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6rem",
                                opacity: isCompleting ? 0.5 : 1,
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {isCompleting ? "Completing..." : "Complete"}
                            </button>
                          )}

                          {/* Snooze button */}
                          {notification.tier === 1 && !snoozedIds.has(notification.id) && (
                            <button
                              onClick={() => handleSnooze(notification)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                              style={{
                                color: "var(--neon-amber)",
                                background: "rgba(245,158,11,0.08)",
                                border: "1px solid rgba(245,158,11,0.15)",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6rem",
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Snooze
                            </button>
                          )}

                          {/* Delegate button (disabled) */}
                          <button
                            disabled
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                            style={{
                              color: "var(--text-muted)",
                              background: "rgba(71,85,105,0.06)",
                              border: "1px solid rgba(71,85,105,0.1)",
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "0.6rem",
                              opacity: 0.4,
                              cursor: "not-allowed",
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="8.5" cy="7" r="4" />
                              <line x1="20" y1="8" x2="20" y2="14" />
                              <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            Delegate
                          </button>

                          {/* Deep link button */}
                          {notification.source_url && (
                            <a
                              href={notification.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ml-auto"
                              style={{
                                color: "var(--neon-blue)",
                                background: "rgba(59,130,246,0.08)",
                                border: "1px solid rgba(59,130,246,0.15)",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6rem",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              Open in {notification.source_type === "clickup" ? "ClickUp" : notification.source_type === "notion" ? "Notion" : "Source"}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
