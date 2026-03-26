"use client";

import React, { useEffect, useState } from "react";

interface Quote { quote_text: string; source_title: string; source_author: string; }
interface BriefingData { available: boolean; date: string; actionItems: string[]; followUps: string[]; decisions: string[]; unresolvedQuestions: string[]; message?: string; }
interface BrainStats { thoughts: number | null; people: number | null; projects: number | null; quotes: number | null; }
interface Task { id: string; title: string; status: string; list_name?: string; assignees?: { username?: string }[]; due_date?: string; external_url?: string; }

export default function OverviewPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [stats, setStats] = useState<BrainStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");

    fetch("/api/quotes").then(r => r.json()).then(d => { if (d.quote_text) setQuote(d); }).catch(() => {});
    fetch("/api/briefing").then(r => r.json()).then(d => setBriefing(d)).catch(() => {});
    fetch("/api/brain-stats").then(r => r.json()).then(d => { if (!d.error) setStats(d); }).catch(() => {});
    fetch("/api/clickup").then(r => r.json()).then(d => {
      if (d.tasks) setTasks(d.tasks.filter((t: Task) => t.status !== "Closed").slice(0, 12));
    }).catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* ─── Greeting ─── */}
      <div className="animate-in mb-10">
        <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 400, color: "var(--text-bright)", fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {greeting}, Donnie
        </h1>
        <p className="mt-1" style={{ color: "var(--text-faint)", fontSize: "14px" }}>
          Open Brain &middot; Command Center
        </p>
      </div>

      {/* ─── North Star (compact banner) ─── */}
      <div
        className="animate-in delay-1 rounded-xl px-8 py-6 mb-10"
        style={{ background: "var(--bg-raised)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="label mb-2" style={{ color: "var(--text-faint)", fontSize: "10px" }}>North Star Principle</p>
            <p style={{ color: "var(--accent)", fontSize: "18px", fontWeight: 500, lineHeight: 1.4 }}>
              &ldquo;Whatever you want in life &mdash; give it away first.&rdquo;
            </p>
          </div>
          {quote && (
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "20px", maxWidth: "400px" }}>
              <p className="italic" style={{ color: "var(--text-dim)", fontSize: "13px", lineHeight: 1.6 }}>
                &ldquo;{quote.quote_text}&rdquo;
              </p>
              <p className="mono mt-1" style={{ color: "var(--text-faint)", fontSize: "11px" }}>
                — {quote.source_author}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Today's Briefing label ─── */}
      <div className="animate-in delay-2 flex items-center justify-between mb-5">
        <p className="label" style={{ fontSize: "11px" }}>Today&apos;s Briefing</p>
        <p className="mono" style={{ color: "var(--text-faint)", fontSize: "11px" }}>{today}</p>
      </div>

      {/* ─── Two-column layout (like Brixton's) ─── */}
      <div className="animate-in delay-3 grid grid-cols-1 lg:grid-cols-5 gap-5 mb-10">

        {/* Left column: Events + Briefing (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Events */}
          <div className="card">
            <div className="flex items-center gap-2.5 mb-4">
              <span style={{ fontSize: "16px", opacity: 0.4 }}>📅</span>
              <div>
                <p style={{ color: "var(--text-bright)", fontSize: "15px", fontWeight: 500 }}>Today&apos;s Events</p>
                <p className="mono" style={{ color: "var(--text-faint)", fontSize: "11px" }}>0 events</p>
              </div>
            </div>
            <p style={{ color: "var(--text-faint)", fontSize: "13px", padding: "20px 0" }}>
              No events today
            </p>
          </div>

          {/* Reminders / Follow-ups */}
          <div className="card">
            <div className="flex items-center gap-2.5 mb-4">
              <span style={{ fontSize: "16px", opacity: 0.4 }}>🔔</span>
              <div>
                <p style={{ color: "var(--text-bright)", fontSize: "15px", fontWeight: 500 }}>Reminders</p>
                <p className="mono" style={{ color: "var(--text-faint)", fontSize: "11px" }}>Next 48 hours</p>
              </div>
            </div>
            {briefing?.available && briefing.followUps.length > 0 ? (
              <div className="space-y-3">
                {briefing.followUps.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "var(--amber)" }} />
                    <span style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>{item.replace(/\*\*/g, "")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-faint)", fontSize: "13px", padding: "20px 0" }}>
                Nothing due in the next 48 hours
              </p>
            )}
          </div>

          {/* Daily Quote */}
          {quote && (
            <div className="card" style={{ borderColor: "var(--accent-glow)" }}>
              <p className="label mb-3" style={{ color: "var(--text-faint)", fontSize: "10px" }}>Daily Wisdom</p>
              <p className="italic" style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.7 }}>
                &ldquo;{quote.quote_text}&rdquo;
              </p>
              <p className="mono mt-3" style={{ color: "var(--text-faint)", fontSize: "11px" }}>
                — {quote.source_author} / {quote.source_title}
              </p>
            </div>
          )}
        </div>

        {/* Right column: Priorities / Tasks (3/5) */}
        <div className="lg:col-span-3">
          <div className="card" style={{ padding: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: "16px", opacity: 0.4 }}>◎</span>
                <p style={{ color: "var(--text-bright)", fontSize: "15px", fontWeight: 500 }}>Priorities</p>
              </div>
              <a href="/action" style={{ color: "var(--red)", fontSize: "13px", fontWeight: 500 }}>
                View all →
              </a>
            </div>

            {/* Tab bar */}
            <div className="flex px-7 pt-4 pb-2 gap-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <button className="pb-2" style={{ color: "var(--text-bright)", fontSize: "13px", fontWeight: 500, borderBottom: "2px solid var(--text-bright)" }}>
                Tasks <span className="mono ml-1" style={{ color: "var(--text-dim)", fontSize: "12px" }}>{tasks.length}</span>
              </button>
              <button className="pb-2" style={{ color: "var(--text-faint)", fontSize: "13px" }}>
                Commitments <span className="mono ml-1" style={{ fontSize: "12px" }}>{briefing?.available ? briefing.actionItems.length : 0}</span>
              </button>
            </div>

            {/* Task list */}
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {tasks.length > 0 ? tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between px-7 py-4 transition-colors"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{
                      background: task.status === "Overdue" || (task.due_date && new Date(task.due_date) < new Date()) ? "var(--red)" : "var(--text-faint)"
                    }} />
                    <div className="min-w-0">
                      <p className="truncate" style={{ color: "var(--text-bright)", fontSize: "14px", lineHeight: 1.4 }}>
                        {task.title}
                      </p>
                      <p className="truncate mt-0.5" style={{ color: "var(--text-faint)", fontSize: "12px" }}>
                        {task.assignees?.[0]?.username || "Unassigned"}
                        {task.status && task.status !== "Open" && (
                          <span className="ml-2" style={{ color: "var(--red)" }}>{task.status}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {task.list_name && (
                      <span
                        className="mono rounded-md px-2 py-0.5 hidden md:inline-block"
                        style={{ background: "var(--bg-raised)", color: "var(--text-dim)", fontSize: "11px", border: "1px solid var(--border)" }}
                      >
                        {task.list_name}
                      </span>
                    )}
                    {task.external_url && (
                      <a
                        href={task.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "var(--text-faint)", fontSize: "14px" }}
                        title="Open in ClickUp"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                <div className="px-7 py-12 text-center">
                  <p style={{ color: "var(--text-faint)", fontSize: "14px" }}>No active tasks</p>
                  <p className="mt-1" style={{ color: "var(--text-faint)", fontSize: "12px" }}>Run the Life Engine to sync your ClickUp tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── System Status ─── */}
      <div className="animate-in delay-4">
        <p className="label mb-4" style={{ fontSize: "11px" }}>System Status</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Active Tasks" value={tasks.length || null} />
          <Stat label="People" value={stats?.people} />
          <Stat label="Projects" value={stats?.projects} />
          <Stat label="KT Quotes" value={stats?.quotes} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <p className="label mb-2">{label}</p>
      <p className="metric" style={{ fontSize: "22px", color: value ? "var(--text-bright)" : "var(--text-faint)" }}>
        {value !== null && value !== undefined ? value : "—"}
      </p>
    </div>
  );
}
