"use client";

import React, { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  workspace: string;
  type: string;
}

interface BriefingData {
  available: boolean;
  date: string;
  source: string;
  actionItems: string[];
  followUps: string[];
  decisions: string[];
  unresolvedQuestions: string[];
  ideas: string[];
  narrative: string;
  message?: string;
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

function formatBriefingDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function DailyBriefing() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);

  useEffect(() => {
    // Fetch calendar events
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data: CalendarEvent[]) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {});

    // Fetch Limitless briefing data
    fetch("/api/briefing")
      .then((res) => res.json())
      .then((data: BriefingData) => {
        setBriefing(data);
      })
      .catch(() => {});
  }, []);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const todayEvents = events.filter((e) => isToday(e.start_time));
  const tomorrowEvents = events.filter((e) => isTomorrow(e.start_time));

  const hasLimitless = briefing?.available === true;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "100ms", opacity: 0 }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.03) 0%, rgba(59,130,246,0.03) 50%, rgba(168,85,247,0.03) 100%)",
          border: "1px solid rgba(179, 170, 163, 0.08)",
        }}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.2)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <span
                  className="text-xs uppercase tracking-[0.2em] font-semibold"
                  style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--neon-cyan)", fontSize: "0.7rem" }}
                >
                  Today&apos;s Briefing
                </span>
                {hasLimitless && briefing?.date && (
                  <span
                    className="block text-xs mt-0.5"
                    style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem" }}
                  >
                    From {formatBriefingDate(briefing.date)}&apos;s Limitless Insights
                  </span>
                )}
              </div>
            </div>
            <span
              className="text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {todayStr}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3" style={{ gap: "20px" }}>
          {/* Top Priorities / Action Items */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "var(--neon-red)", boxShadow: "0 0 6px var(--neon-red)" }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--neon-red)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
              >
                {hasLimitless ? "Action Items" : "Top Priorities"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {hasLimitless && briefing!.actionItems.length > 0 ? (
                briefing!.actionItems.map((item, idx) => (
                  <div key={`a-${idx}`} className="flex items-start gap-2.5">
                    <span
                      className="text-xs font-bold mt-0.5 shrink-0 metric-value"
                      style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}
                    >
                      {idx + 1}.
                    </span>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                      {item.replace(/\*\*/g, "")}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-bold mt-0.5 shrink-0 metric-value" style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}>1.</span>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>PG Q1 revenue review with Brixton</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-bold mt-0.5 shrink-0 metric-value" style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}>2.</span>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>Restitution payment &mdash; verify March submission</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-bold mt-0.5 shrink-0 metric-value" style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}>3.</span>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>Open Brain dashboard rebuild</span>
                  </div>
                </>
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
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "var(--neon-blue)", boxShadow: "0 0 6px var(--neon-blue)" }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--neon-blue)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
              >
                Today&apos;s Schedule
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-2.5">
                    <span
                      className="text-xs font-medium mt-0.5 shrink-0 metric-value"
                      style={{ color: "var(--neon-blue)", fontSize: "0.6rem", minWidth: "60px" }}
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
                            className="text-xs font-medium mt-0.5 shrink-0 metric-value"
                            style={{ color: "var(--text-muted)", fontSize: "0.6rem", minWidth: "60px" }}
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

              {/* Decisions from yesterday */}
              {hasLimitless && briefing!.decisions.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.5rem" }}>
                    Yesterday&apos;s Decisions
                  </span>
                  {briefing!.decisions.slice(0, 2).map((d, i) => (
                    <div key={`d-${i}`} className="flex items-start gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-blue)", opacity: 0.5 }} />
                      <span className="text-xs leading-snug" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
                        {d.replace(/\*\*/g, "").replace(/^\*?Decision\*?:?\s*/i, "")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Follow-Ups / Pending Actions */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "var(--neon-amber)", boxShadow: "0 0 6px var(--neon-amber)" }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--neon-amber)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
              >
                {hasLimitless ? "Follow-Ups" : "Pending Actions"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {hasLimitless && briefing!.followUps.length > 0 ? (
                briefing!.followUps.map((item, idx) => (
                  <div key={`f-${idx}`} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-amber)" }} />
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                      {item.replace(/\*\*/g, "")}
                    </span>
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

              {/* Unresolved questions */}
              {hasLimitless && briefing!.unresolvedQuestions.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.5rem" }}>
                    Unresolved
                  </span>
                  {briefing!.unresolvedQuestions.slice(0, 2).map((q, i) => (
                    <div key={`q-${i}`} className="flex items-start gap-2 mb-2">
                      <span className="text-xs mt-0.5 shrink-0" style={{ color: "var(--neon-amber)", opacity: 0.6 }}>?</span>
                      <span className="text-xs leading-snug" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
                        {q.replace(/\*\*/g, "")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Not connected fallback */}
              {!hasLimitless && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--neon-purple)", opacity: 0.5 }} />
                    <span
                      className="text-xs italic"
                      style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
                    >
                      {briefing?.message || "Connect local Limitless sync for daily briefing"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
