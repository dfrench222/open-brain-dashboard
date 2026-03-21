"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  workspace: string;
  type: string;
}

/* Verified personal events (from Don's memory / records) */
const verifiedEvents = [
  { name: "Penny's Spring Break", date: "Apr 5-12", type: "family", verified: true },
  { name: "Caitlin's Birthday", date: "May 28", type: "family", verified: true },
  { name: "Brian Visit \u2014 Michigan", date: "May 2-4", type: "travel", verified: true },
];

export default function PersonalLife() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [hasCalendar, setHasCalendar] = useState(false);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data: CalendarEvent[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setCalendarEvents(data);
          setHasCalendar(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <GlassCard delay={400}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-purple)">
          Personal Life
        </NeonText>
      </div>

      {/* Key people — VERIFIED */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        {/* Penny */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  color: "var(--neon-purple)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.55rem",
                }}
              >
                PF
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                  Penelope (Penny)
                </span>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
                  Rome, Italy &middot; RIS Year 11
                </span>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1.5 rounded shrink-0 whitespace-nowrap"
              style={{
                color: "var(--neon-green)",
                background: "rgba(34,197,94,0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
              }}
            >
              All Good
            </span>
          </div>
        </div>

        {/* Caitlin */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "var(--neon-red)",
                border: "1px solid rgba(239,68,68,0.3)",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.55rem",
              }}
            >
              CF
            </div>
            <div className="min-w-0">
              <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                Caitlin French
              </span>
              <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>
                Wife &middot; Birthday May 28
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Health metrics — REMOVED: Don doesn't wear a tracker */}

      {/* Calendar */}
      <div>
        <span
          className="text-xs uppercase tracking-wider block mb-4"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em" }}
        >
          Upcoming
        </span>

        {/* Verified events */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {verifiedEvents.map((event) => (
            <div
              key={event.name}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--glass-border)",
                gap: "12px",
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                {event.name}
              </span>
              <span
                className="text-xs shrink-0 whitespace-nowrap metric-value"
                style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
              >
                {event.date}
              </span>
            </div>
          ))}
        </div>

        {/* Google Calendar integration status */}
        {!hasCalendar && (
          <div
            className="mt-4 p-4 rounded-xl"
            style={{
              border: "1px dashed rgba(179, 170, 163, 0.15)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span
              className="text-xs flex items-center gap-1.5 italic"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Connect Google Calendar for live schedule
            </span>
          </div>
        )}

        {/* Real calendar events if available */}
        {hasCalendar && calendarEvents.length > 0 && (
          <div className="mt-3" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {calendarEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--glass-border)",
                  gap: "12px",
                }}
              >
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {event.title}
                </span>
                <span
                  className="text-xs shrink-0 whitespace-nowrap metric-value"
                  style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
                >
                  {new Date(event.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
