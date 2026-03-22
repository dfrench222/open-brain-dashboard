"use client";

import React, { useEffect, useState } from "react";

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

interface CalendarResponse {
  events: { id: string; title: string; start_time: string }[];
  connected: boolean;
  message?: string;
}

function formatBriefingDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function DailyBriefing() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    fetch("/api/briefing")
      .then((res) => res.json())
      .then((data: BriefingData) => setBriefing(data))
      .catch(() => {});

    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data: CalendarResponse) => {
        setCalendarConnected(data.connected);
      })
      .catch(() => {});
  }, []);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hasLimitless = briefing?.available === true;

  return (
    <div className="animate-fade-in-up delay-100" style={{ opacity: 0 }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.03) 0%, rgba(59,130,246,0.03) 50%, rgba(168,85,247,0.03) 100%)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "var(--accent)", fontSize: "0.7rem", letterSpacing: "0.15em" }}
              >
                Today&apos;s Briefing
              </span>
              {hasLimitless && briefing?.date && (
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
                >
                  From {formatBriefingDate(briefing.date)}&apos;s Limitless Insights
                </span>
              )}
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
          {/* Action Items */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--neon-red)" }} />
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}>
                {hasLimitless ? "Action Items" : "Top Priorities"}
              </span>
            </div>
            <div className="space-y-3">
              {hasLimitless && briefing!.actionItems.length > 0 ? (
                briefing!.actionItems.map((item, idx) => (
                  <div key={`a-${idx}`} className="flex items-start gap-2.5">
                    <span className="text-xs font-bold mt-0.5 shrink-0 metric-value" style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}>
                      {idx + 1}.
                    </span>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                      {item.replace(/\*\*/g, "")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                  {briefing?.message || "No data available"}
                </p>
              )}
            </div>
          </div>

          {/* Today's Schedule */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--neon-blue)" }} />
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--neon-blue)", fontSize: "0.65rem" }}>
                Today&apos;s Schedule
              </span>
            </div>
            <div className="space-y-3">
              {!calendarConnected ? (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  <span className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                    Connect Google Calendar
                  </span>
                </div>
              ) : (
                <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                  No events today
                </p>
              )}

              {/* Decisions from yesterday */}
              {hasLimitless && briefing!.decisions.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
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

          {/* Follow-Ups */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--neon-amber)" }} />
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--neon-amber)", fontSize: "0.65rem" }}>
                {hasLimitless ? "Follow-Ups" : "Pending Actions"}
              </span>
            </div>
            <div className="space-y-3">
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
                <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                  No follow-ups
                </p>
              )}

              {/* Unresolved */}
              {hasLimitless && briefing!.unresolvedQuestions.length > 0 && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-xs block mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
