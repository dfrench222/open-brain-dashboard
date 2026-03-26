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
      {/* Section label */}
      <h2 className="section-heading mb-5">Today&apos;s Briefing</h2>

      {/* Tier 1: At-a-Glance Summary */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(23, 21, 21, 0.9) 0%, rgba(31, 28, 28, 0.7) 100%)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="uppercase font-semibold"
              style={{ color: "var(--accent)", fontSize: "0.7rem", letterSpacing: "0.15em" }}
            >
              Today at a Glance
            </span>
            {hasLimitless && (
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(0,255,200,0.08)",
                  color: "var(--accent)",
                  fontSize: "0.55rem",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Live
              </span>
            )}
          </div>
          <span
            className="metric-value"
            style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
          >
            {todayStr}
          </span>
        </div>

        {hasLimitless && briefing?.date && (
          <p
            className="metric-value mb-3"
            style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
          >
            Source: {formatBriefingDate(briefing.date)}&apos;s Limitless Insights
          </p>
        )}

        {/* Summary row */}
        <div
          className="flex flex-wrap gap-5 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-red)" }} />
            {hasLimitless ? `${briefing!.actionItems.length} action items` : "No actions yet"}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-amber)" }} />
            {hasLimitless ? `${briefing!.followUps.length} follow-ups` : "No follow-ups"}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-blue)" }} />
            {calendarConnected ? "Calendar connected" : "Calendar pending"}
          </span>
        </div>
      </div>

      {/* Tier 2: Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Action Items */}
        <div
          className="glass-card p-6"
          style={{
            borderColor: hasLimitless && briefing!.actionItems.length > 0
              ? "rgba(239,68,68,0.12)"
              : undefined,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--neon-red)" }} />
            <span
              className="uppercase tracking-wider font-semibold"
              style={{ color: "var(--neon-red)", fontSize: "0.65rem", letterSpacing: "0.08em" }}
            >
              {hasLimitless ? "Action Items" : "Top Priorities"}
            </span>
          </div>
          <div className="space-y-4">
            {hasLimitless && briefing!.actionItems.length > 0 ? (
              briefing!.actionItems.map((item, idx) => (
                <div key={`a-${idx}`} className="flex items-start gap-3">
                  <span
                    className="metric-value font-bold mt-0.5 shrink-0"
                    style={{ color: "var(--neon-red)", fontSize: "0.65rem" }}
                  >
                    {idx + 1}.
                  </span>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.replace(/\*\*/g, "")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                {briefing?.message || "Waiting for Limitless data"}
              </p>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--neon-blue)" }} />
            <span
              className="uppercase tracking-wider font-semibold"
              style={{ color: "var(--neon-blue)", fontSize: "0.65rem", letterSpacing: "0.08em" }}
            >
              Today&apos;s Schedule
            </span>
          </div>
          <div className="space-y-4">
            {!calendarConnected ? (
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ border: "1px dashed rgba(179,170,163,0.12)" }}
              >
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
              <div className="pt-4 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
                <span
                  className="block mb-3 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontSize: "0.6rem", letterSpacing: "0.08em" }}
                >
                  Yesterday&apos;s Decisions
                </span>
                <div className="space-y-3">
                  {briefing!.decisions.slice(0, 2).map((d, i) => (
                    <div key={`d-${i}`} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-blue)", opacity: 0.5 }} />
                      <span
                        className="leading-snug"
                        style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
                      >
                        {d.replace(/\*\*/g, "").replace(/^\*?Decision\*?:?\s*/i, "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Follow-Ups */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--neon-amber)" }} />
            <span
              className="uppercase tracking-wider font-semibold"
              style={{ color: "var(--neon-amber)", fontSize: "0.65rem", letterSpacing: "0.08em" }}
            >
              {hasLimitless ? "Follow-Ups" : "Pending Actions"}
            </span>
          </div>
          <div className="space-y-4">
            {hasLimitless && briefing!.followUps.length > 0 ? (
              briefing!.followUps.map((item, idx) => (
                <div key={`f-${idx}`} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-amber)" }} />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
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
              <div className="pt-4 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
                <span
                  className="block mb-3 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontSize: "0.6rem", letterSpacing: "0.08em" }}
                >
                  Unresolved
                </span>
                <div className="space-y-3">
                  {briefing!.unresolvedQuestions.slice(0, 2).map((q, i) => (
                    <div key={`q-${i}`} className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0" style={{ color: "var(--neon-amber)", opacity: 0.5, fontSize: "0.7rem" }}>?</span>
                      <span
                        className="leading-snug"
                        style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
                      >
                        {q.replace(/\*\*/g, "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
