"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { HeroStats } from "@/components/HeroStats";
import { BriefingNarrative } from "@/components/BriefingNarrative";
import { Schedule } from "@/components/Schedule";
import { Suggestions } from "@/components/Suggestions";
import { SlackTier1 } from "@/components/SlackTier1";
import { logAction } from "@/lib/logAction";

interface Quote {
  quote_text: string;
  source_title: string;
  source_author: string;
}

interface BriefingData {
  available: boolean;
  date: string;
  actionItems: (string | { title: string; why?: string; source?: string; priority?: string })[];
  followUps: (string | { title: string; why?: string; overdue?: boolean })[];
  decisions: (string | { decision: string; context?: string })[];
  narrative?: string;
  title?: string;
  schedule?: { title?: string; start_time?: string; end_time?: string; workspace?: string; attendees?: { email: string; name: string }[]; ai_prep_notes?: string; id?: string }[];
  suggestions?: { directive?: string; time_estimate?: string; reason?: string; priority?: string; source?: string }[];
  insights?: string[];
  metadata?: { stats?: { meetings_today?: number; focus_hours_available?: number; overdue_tasks_clickup?: number; tier1_messages?: number } };
  message?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  workspace: string;
  attendees?: { email: string; name: string }[];
  ai_prep_notes?: string;
}

interface SlackMsg {
  id: string;
  external_id: string;
  channel_name: string;
  sender_name: string;
  preview: string;
  timestamp: string;
  workspace: string;
  source: string;
}

export default function OverviewPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [slackTier1, setSlackTier1] = useState<SlackMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [dismissedSlack, setDismissedSlack] = useState<string[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
    );

    // Load dismissed items from localStorage
    try {
      const d = JSON.parse(localStorage.getItem("ob-dismissed-slack") || "[]");
      setDismissedSlack(d);
    } catch {
      /* ignore */
    }

    // Fetch all data in parallel
    Promise.all([
      fetch("/api/quotes").then((r) => r.json()).catch(() => null),
      fetch("/api/briefing").then((r) => r.json()).catch(() => null),
      fetch("/api/calendar").then((r) => r.json()).catch(() => ({ events: [] })),
      fetch("/api/slack-tier1").then((r) => r.json()).catch(() => ({ messages: [] })),
    ]).then(([quoteData, briefingData, calendarData, slackData]) => {
      if (quoteData?.quote_text) setQuote(quoteData);
      if (briefingData) setBriefing(briefingData);
      if (calendarData?.events) setCalendar(calendarData.events);
      if (slackData?.messages) setSlackTier1(slackData.messages);
      setLoading(false);
    });
  }, []);

  const handleDismissSlack = useCallback((id: string) => {
    setDismissedSlack((prev) => {
      const next = [...prev, id];
      localStorage.setItem("ob-dismissed-slack", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleActionDone = useCallback(
    (item: string, index: number) => {
      logAction("done", "briefing_action_items", `action-${index}`, {
        item,
        source: "overview",
      });
    },
    []
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Compute stats from briefing metadata or calendar
  const stats = briefing?.metadata?.stats;
  const meetingsToday = stats?.meetings_today ?? calendar.length;
  const focusHours = stats?.focus_hours_available ?? 0;
  const actionCount =
    (briefing?.actionItems?.length || 0) +
    (briefing?.followUps?.length || 0);
  const hasOverdue = stats?.overdue_tasks_clickup
    ? stats.overdue_tasks_clickup > 0
    : (briefing?.followUps?.length || 0) > 0;

  const filteredSlack = slackTier1.filter(
    (m) => !dismissedSlack.includes(m.id || m.external_id)
  );

  if (loading) {
    return (
      <div>
        <div className="animate-in mb-10">
          <h1
            style={{
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 400,
              color: "var(--text-bright)",
              fontStyle: "italic",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Loading briefing...
          </h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <LoadingSkeleton lines={1} height="100px" />
          <LoadingSkeleton lines={4} />
          <LoadingSkeleton lines={3} />
          <LoadingSkeleton lines={5} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ─── Greeting ─── */}
      <div className="animate-in" style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 400,
            color: "var(--text-bright)",
            fontStyle: "italic",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {greeting}, Donnie
        </h1>
        <p style={{ color: "var(--text-faint)", fontSize: "14px", marginTop: "4px" }}>
          {today}
        </p>
      </div>

      {/* ─── Hero Stats ─── */}
      <PanelErrorBoundary label="Hero Stats">
        <div className="animate-in delay-1" style={{ marginBottom: "20px" }}>
          <HeroStats
            meetingsToday={meetingsToday}
            focusHours={focusHours}
            actionCount={actionCount}
            hasOverdue={hasOverdue}
          />
        </div>
      </PanelErrorBoundary>

      {/* ─── Narrative ─── */}
      <PanelErrorBoundary label="Briefing">
        <div className="animate-in delay-2" style={{ marginBottom: "20px" }}>
          <BriefingNarrative
            narrative={briefing?.narrative || "No briefing available — run /life-engine to generate"}
            date={briefing?.date || today}
          />
        </div>
      </PanelErrorBoundary>

      {/* ─── Schedule ─── */}
      <PanelErrorBoundary label="Schedule">
        <div className="animate-in delay-3" style={{ marginBottom: "20px" }}>
          <Schedule events={calendar} />
        </div>
      </PanelErrorBoundary>

      {/* ─── Suggestions ─── */}
      <PanelErrorBoundary label="Suggestions">
        <div className="animate-in delay-4" style={{ marginBottom: "20px" }}>
          <Suggestions suggestions={(briefing?.suggestions || []) as { directive: string; time_estimate: string; reason: string; priority: string; source: string }[]} />
        </div>
      </PanelErrorBoundary>

      {/* ─── Action Items + Follow-Ups (2 column) ─── */}
      <div
        className="animate-in delay-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{
          marginBottom: "20px",
        }}
      >
        <PanelErrorBoundary label="Action Items">
          <div className="card" style={{ padding: "20px 24px" }}>
            <div className="label" style={{ marginBottom: "16px" }}>
              Action Items
            </div>
            {briefing?.actionItems && briefing.actionItems.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {briefing.actionItems.map((rawItem, i) => {
                  let item = rawItem;
                  // Handle stringified JSON objects
                  if (typeof item === "string") {
                    try { item = JSON.parse(item); } catch { /* keep as string */ }
                  }
                  const title = typeof item === "string" ? item : (item as { title?: string; task?: string }).title || (item as { task?: string }).task || JSON.stringify(item);
                  const why = typeof item === "string" ? null : (item as { why?: string; reason?: string }).why || (item as { reason?: string }).reason;

                  return (
                    <div
                      key={i}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "var(--bg-raised)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--text-bright)",
                          lineHeight: 1.4,
                          marginBottom: why ? "4px" : 0,
                        }}
                      >
                        {title}
                      </div>
                      {why && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-dim)",
                            lineHeight: 1.4,
                            marginBottom: "8px",
                          }}
                        >
                          {why}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => handleActionDone(title, i)}
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "3px 10px",
                            borderRadius: "5px",
                            background: "rgba(50,213,131,0.1)",
                            color: "var(--green)",
                            border: "1px solid rgba(50,213,131,0.2)",
                            cursor: "pointer",
                          }}
                        >
                          Done
                        </button>
                        <button
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "3px 10px",
                            borderRadius: "5px",
                            background: "var(--bg-hover)",
                            color: "var(--text-dim)",
                            border: "1px solid var(--border)",
                            cursor: "pointer",
                          }}
                        >
                          Defer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: "14px", color: "var(--text-dim)" }}>
                No action items in today&apos;s briefing
              </div>
            )}
          </div>
        </PanelErrorBoundary>

        <PanelErrorBoundary label="Follow-Ups">
          <div className="card" style={{ padding: "20px 24px" }}>
            <div className="label" style={{ marginBottom: "16px" }}>
              Follow-Ups
            </div>
            {briefing?.followUps && briefing.followUps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {briefing.followUps.map((rawItem, i) => {
                  let item = rawItem;
                  if (typeof item === "string") {
                    try { item = JSON.parse(item); } catch { /* keep as string */ }
                  }
                  const title = typeof item === "string" ? item : (item as { title?: string; task?: string }).title || (item as { task?: string }).task || JSON.stringify(item);
                  const why = typeof item === "string" ? null : (item as { why?: string; reason?: string }).why || (item as { reason?: string }).reason;
                  const overdue = typeof item !== "string" && (item as { overdue?: boolean }).overdue;

                  return (
                    <div
                      key={i}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: overdue
                          ? "rgba(240,68,56,0.04)"
                          : "var(--bg-raised)",
                        border: overdue
                          ? "1px solid rgba(240,68,56,0.15)"
                          : "1px solid var(--border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {overdue && (
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: "var(--red)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--text-bright)",
                            lineHeight: 1.4,
                          }}
                        >
                          {title}
                        </span>
                      </div>
                      {why && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-dim)",
                            lineHeight: 1.4,
                            marginTop: "4px",
                          }}
                        >
                          {why}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                        <button
                          onClick={() => {
                            logAction("done", "briefing_follow_ups", `followup-${i}`, { item: title });
                          }}
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "3px 10px",
                            borderRadius: "5px",
                            background: "rgba(50,213,131,0.1)",
                            color: "var(--green)",
                            border: "1px solid rgba(50,213,131,0.2)",
                            cursor: "pointer",
                          }}
                        >
                          Done
                        </button>
                        <button
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "3px 10px",
                            borderRadius: "5px",
                            background: "rgba(247,144,9,0.1)",
                            color: "var(--amber)",
                            border: "1px solid rgba(247,144,9,0.2)",
                            cursor: "pointer",
                          }}
                        >
                          Nudge
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: "14px", color: "var(--text-dim)" }}>
                No follow-ups pending
              </div>
            )}
          </div>
        </PanelErrorBoundary>
      </div>

      {/* ─── Decisions Yesterday ─── */}
      {briefing?.decisions && briefing.decisions.length > 0 && (
        <PanelErrorBoundary label="Decisions">
          <div className="animate-in" style={{ marginBottom: "20px" }}>
            <div className="card" style={{ padding: "20px 24px" }}>
              <div className="label" style={{ marginBottom: "12px" }}>
                Decisions Made Yesterday
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {briefing.decisions.map((d, i) => {
                  const text = typeof d === "string" ? d : d.decision;
                  const ctx = typeof d === "string" ? null : d.context;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "var(--accent)",
                          flexShrink: 0,
                          marginTop: "7px",
                        }}
                      />
                      <div>
                        <span style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.5 }}>
                          {text}
                        </span>
                        {ctx && (
                          <span style={{ fontSize: "12px", color: "var(--text-faint)", display: "block" }}>
                            {ctx}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PanelErrorBoundary>
      )}

      {/* ─── Slack Tier 1 ─── */}
      <PanelErrorBoundary label="Slack">
        <div className="animate-in" style={{ marginBottom: "20px" }}>
          <SlackTier1 messages={filteredSlack} onDismiss={handleDismissSlack} />
        </div>
      </PanelErrorBoundary>

      {/* ─── Daily Quote ─── */}
      {quote && (
        <div className="animate-in" style={{ marginBottom: "20px" }}>
          <div
            className="card"
            style={{
              padding: "20px 24px",
              borderLeft: "3px solid var(--text-faint)",
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontStyle: "italic",
                color: "var(--text)",
                lineHeight: 1.6,
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              &ldquo;{quote.quote_text}&rdquo;
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-dim)",
                marginTop: "8px",
              }}
            >
              — {quote.source_author}
              {quote.source_title && `, ${quote.source_title}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
