"use client";

import React, { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  workspace: string;
  type: string;
}

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  list: string;
}

interface NotionPage {
  id: string;
  title: string;
  status?: string;
  url?: string;
}

function formatTime(isoStr: string): string {
  const date = new Date(isoStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function isToday(isoStr: string): boolean {
  const date = new Date(isoStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isTomorrow(isoStr: string): boolean {
  const date = new Date(isoStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

export default function DailyBriefing() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [priorities, setPriorities] = useState<{ id: string; text: string; source: string; url?: string }[]>([]);
  const [pendingActions, setPendingActions] = useState<{ id: string; text: string; source: string }[]>([]);

  useEffect(() => {
    // Fetch calendar events
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data: CalendarEvent[]) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {});

    // Fetch ClickUp tasks for priorities
    fetch("/api/clickup")
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks) {
          const urgent = data.tasks
            .filter((t: ClickUpTask) => {
              if (t.status === "hold for launch" || t.status === "Closed") return false;
              const due = t.due_date ? new Date(t.due_date).getTime() : null;
              return (
                t.status === "in progress" ||
                (due && due < Date.now() + 2 * 86400000)
              );
            })
            .slice(0, 3)
            .map((t: ClickUpTask) => ({
              id: `cu-${t.id}`,
              text: t.name,
              source: "ClickUp",
              url: `https://app.clickup.com/t/${t.id}`,
            }));
          setPriorities((prev) => [...urgent, ...prev].slice(0, 5));
        }
      })
      .catch(() => {});

    // Fetch Notion pages for pending actions
    fetch("/api/notion")
      .then((res) => res.json())
      .then((data) => {
        if (data.pages) {
          const pending = data.pages
            .filter((p: NotionPage) => p.status === "in-progress" || p.status === "pending")
            .slice(0, 3)
            .map((p: NotionPage) => ({
              id: `n-${p.id}`,
              text: p.title,
              source: "Notion",
            }));
          setPendingActions(pending);
        }
      })
      .catch(() => {});

    // Add fallback priorities if API data is light
    setPriorities((prev) => {
      if (prev.length === 0) {
        return [
          { id: "p1", text: "PG Q1 revenue review with Brixton", source: "PG" },
          { id: "p2", text: "Restitution payment — verify March submission", source: "Finance" },
          { id: "p3", text: "Open Brain dashboard rebuild", source: "Projects" },
        ];
      }
      return prev;
    });
  }, []);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const todayEvents = events.filter((e) => isToday(e.start_time));
  const tomorrowEvents = events.filter((e) => isTomorrow(e.start_time));

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "100ms", opacity: 0 }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.04) 0%, rgba(59,130,246,0.04) 50%, rgba(168,85,247,0.04) 100%)",
          border: "1px solid rgba(0,255,200,0.12)",
        }}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.2)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span
                className="text-xs uppercase tracking-[0.2em] font-semibold"
                style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-cyan)", fontSize: "0.7rem" }}
              >
                Today&apos;s Briefing
              </span>
            </div>
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {todayStr}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Top Priorities */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--neon-red)", boxShadow: "0 0 6px var(--neon-red)" }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--neon-red)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
              >
                Top Priorities
              </span>
            </div>
            <div className="space-y-3">
              {priorities.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="flex items-start gap-2.5">
                  <span
                    className="text-xs font-bold mt-0.5 shrink-0"
                    style={{ color: "var(--neon-red)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
                  >
                    {idx + 1}.
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm block leading-snug" style={{ color: "var(--text-primary)" }}>
                      {p.text}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
                      {p.source}
                    </span>
                  </div>
                </div>
              ))}
              {priorities.length === 0 && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>No urgent items</p>
              )}
            </div>
          </div>

          {/* Today's Schedule */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--neon-blue)", boxShadow: "0 0 6px var(--neon-blue)" }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--neon-blue)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
              >
                Today&apos;s Schedule
              </span>
            </div>
            <div className="space-y-3">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-2.5">
                    <span
                      className="text-xs font-medium mt-0.5 shrink-0"
                      style={{ color: "var(--neon-blue)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", minWidth: "60px" }}
                    >
                      {formatTime(event.start_time)}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm block leading-snug" style={{ color: "var(--text-primary)" }}>
                        {event.title}
                      </span>
                      {event.location && (
                        <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No meetings today</p>
                  {tomorrowEvents.length > 0 && (
                    <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <span className="text-xs block mb-2" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>TOMORROW</span>
                      {tomorrowEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="flex items-start gap-2.5 mb-2">
                          <span
                            className="text-xs font-medium mt-0.5 shrink-0"
                            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", minWidth: "60px" }}
                          >
                            {formatTime(event.start_time)}
                          </span>
                          <span className="text-sm leading-snug" style={{ color: "var(--text-muted)" }}>
                            {event.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Limitless integration placeholder */}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "var(--neon-purple)", opacity: 0.5 }}
                  />
                  <span
                    className="text-xs italic"
                    style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
                  >
                    Limitless Daily Insights will appear here once connected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--neon-amber)", boxShadow: "0 0 6px var(--neon-amber)" }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--neon-amber)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
              >
                Pending Actions
              </span>
            </div>
            <div className="space-y-3">
              {pendingActions.length > 0 ? (
                pendingActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: "var(--neon-amber)" }}
                    />
                    <div className="min-w-0">
                      <span className="text-sm block leading-snug" style={{ color: "var(--text-primary)" }}>
                        {action.text}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
                        {action.source}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-amber)" }} />
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                      Verify March restitution payment
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-amber)" }} />
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                      Confirm Penny tuition payment
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
