"use client";

import React, { useState, useEffect } from "react";

interface Notification {
  id: string;
  tier: 1 | 2 | 3;
  message: string;
  source: string;
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
}

const tierConfig = {
  1: { color: "var(--neon-red)", bg: "rgba(239,68,68,0.08)", label: "NEEDS ATTENTION", icon: "!!" },
  2: { color: "var(--neon-amber)", bg: "rgba(245,158,11,0.08)", label: "CHECK LATER", icon: "!" },
  3: { color: "var(--text-muted)", bg: "rgba(71,85,105,0.06)", label: "WHEN FREE", icon: "~" },
};

function classifyClickUpTask(task: ClickUpTask): 1 | 2 | 3 {
  const now = Date.now();
  const due = task.due_date ? new Date(task.due_date).getTime() : null;

  // Overdue or in progress = Tier 1
  if (due && due < now) return 1;
  if (task.status === "in progress") return 1;

  // Due within 7 days = Tier 2
  if (due && due < now + 7 * 86400000) return 2;
  if (task.status === "ready") return 2;

  // Everything else = Tier 3
  return 3;
}

function classifyNotionPage(page: NotionPage): 1 | 2 | 3 {
  if (page.status === "in-progress") return 1;
  if (page.status === "pending") return 2;
  return 3;
}

const fallbackNotifications: Notification[] = [
  { id: "f1", tier: 1, message: "Restitution payment due March 25", source: "Finance" },
  { id: "f2", tier: 1, message: "PG Q1 revenue review — schedule with Brixton", source: "Performance Golf" },
  { id: "f3", tier: 2, message: "Penny spring break schedule — confirm dates with Araba", source: "Family" },
  { id: "f4", tier: 2, message: "De French 2.0 content calendar review", source: "Projects" },
  { id: "f5", tier: 3, message: "Update knowledge base distillation pipeline", source: "Second Brain" },
  { id: "f6", tier: 3, message: "Freedom Factor project kickoff planning", source: "Projects" },
];

export default function NotificationBar() {
  const [expanded, setExpanded] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(fallbackNotifications);

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
                message: `${task.name}${task.list ? ` (${task.list})` : ""}`,
                source: "ClickUp / PG",
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
              source: "Notion / JL",
            });
          });
        }
      } catch {
        // Notion unavailable
      }

      // Always include key standing items
      items.push(
        { id: "static-1", tier: 1, message: "Restitution payment due March 25", source: "Finance" },
        { id: "static-2", tier: 2, message: "Penny spring break schedule — confirm dates with Araba", source: "Family" },
      );

      // Sort by tier then deduplicate
      items.sort((a, b) => a.tier - b.tier);

      if (items.length > 0) {
        setNotifications(items);
      }
    };

    fetchAll();
  }, []);

  const tier1Count = notifications.filter((n) => n.tier === 1).length;
  const tier2Count = notifications.filter((n) => n.tier === 2).length;
  const tier3Count = notifications.filter((n) => n.tier === 3).length;

  const visibleNotifications = expanded ? notifications : notifications.filter((n) => n.tier === 1);

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
          <div className="mt-3 space-y-2">
            {visibleNotifications.map((notification, i) => {
              const config = tierConfig[notification.tier];
              return (
                <div
                  key={notification.id}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 animate-slide-in-left"
                  style={{
                    background: config.bg,
                    border: `1px solid ${config.color}15`,
                    animationDelay: `${i * 50}ms`,
                    opacity: 0,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      color: config.color,
                      background: `${config.color}15`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {config.icon}
                  </span>
                  <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
                    {notification.message}
                  </span>
                  <span
                    className="text-xs shrink-0"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {notification.source}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
