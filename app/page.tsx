"use client";

import React, { useEffect, useState } from "react";

interface Quote {
  quote_text: string;
  source_title: string;
  source_author: string;
}

interface BriefingData {
  available: boolean;
  date: string;
  actionItems: string[];
  followUps: string[];
  decisions: string[];
  unresolvedQuestions: string[];
  message?: string;
}

interface BrainStats {
  thoughts: number | null;
  people: number | null;
  projects: number | null;
  quotes: number | null;
}

export default function OverviewPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [stats, setStats] = useState<BrainStats | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/quotes").then(r => r.json()).then(d => { if (d.quote_text) setQuote(d); }).catch(() => {});
    fetch("/api/briefing").then(r => r.json()).then(d => setBriefing(d)).catch(() => {});
    fetch("/api/brain-stats").then(r => r.json()).then(d => { if (!d.error) setStats(d); }).catch(() => {});
    fetch("/api/clickup").then(r => r.json()).then(d => { if (d.total !== undefined) setTaskCount(d.total); }).catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* ─── North Star ─── */}
      <section className="animate-in mb-12">
        <div
          className="rounded-2xl px-8 py-10 md:px-12 md:py-14 text-center"
          style={{
            background: "linear-gradient(145deg, var(--bg-raised) 0%, var(--bg-card) 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="label mb-6" style={{ color: "var(--text-faint)" }}>North Star Principle</p>
          <h1
            className="font-semibold leading-snug mx-auto"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--accent)",
              maxWidth: "600px",
              lineHeight: 1.4,
            }}
          >
            &ldquo;Whatever you want in life &mdash; give it away first.&rdquo;
          </h1>

          {quote && (
            <>
              <div
                className="mx-auto my-8"
                style={{ width: "40px", height: "1px", background: "var(--border-strong)" }}
              />
              <p
                className="italic mx-auto"
                style={{
                  color: "var(--text-dim)",
                  fontSize: "15px",
                  maxWidth: "520px",
                  lineHeight: 1.7,
                }}
              >
                &ldquo;{quote.quote_text}&rdquo;
              </p>
              <p className="mono mt-4" style={{ color: "var(--text-faint)", fontSize: "12px" }}>
                &mdash; {quote.source_author} / {quote.source_title}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ─── Daily Briefing ─── */}
      <section className="animate-in delay-1 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="label" style={{ fontSize: "12px" }}>Today&apos;s Briefing</h2>
          <span className="mono" style={{ color: "var(--text-faint)", fontSize: "12px" }}>{today}</span>
        </div>

        {/* Summary bar */}
        <div
          className="rounded-xl px-6 py-4 mb-6 flex flex-wrap gap-6"
          style={{ background: "var(--bg-raised)", border: "1px solid var(--border)" }}
        >
          <Pill color="var(--red)" text={briefing?.available ? `${briefing.actionItems.length} actions` : "No actions yet"} />
          <Pill color="var(--amber)" text={briefing?.available ? `${briefing.followUps.length} follow-ups` : "No follow-ups"} />
          <Pill color="var(--blue)" text="Calendar pending" />
          {briefing?.available && (
            <span className="mono ml-auto" style={{ color: "var(--text-faint)", fontSize: "11px" }}>
              Source: Limitless
            </span>
          )}
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <BriefingCard
            title="Action Items"
            color="var(--red)"
            items={briefing?.available ? briefing.actionItems : []}
            emptyText={briefing?.message || "Run /life-engine to generate briefing"}
            delay="delay-2"
          />
          <BriefingCard
            title="Today&apos;s Schedule"
            color="var(--blue)"
            items={[]}
            emptyText="Connect Google Calendar"
            delay="delay-3"
          />
          <BriefingCard
            title="Follow-Ups"
            color="var(--amber)"
            items={briefing?.available ? briefing.followUps : []}
            emptyText="No follow-ups"
            delay="delay-4"
          />
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="animate-in delay-5">
        <h2 className="label mb-5" style={{ fontSize: "12px" }}>System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Active Tasks" value={taskCount} />
          <Stat label="People" value={stats?.people} />
          <Stat label="Projects" value={stats?.projects} />
          <Stat label="KT Quotes" value={stats?.quotes} />
        </div>
      </section>
    </div>
  );
}

function Pill({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-2" style={{ fontSize: "13px", color: "var(--text)" }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {text}
    </span>
  );
}

function BriefingCard({
  title,
  color,
  items,
  emptyText,
  delay,
}: {
  title: string;
  color: string;
  items: string[];
  emptyText: string;
  delay: string;
}) {
  return (
    <div className={`card animate-in ${delay}`}>
      <div className="flex items-center gap-2.5 mb-5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
        <span className="label" style={{ color, fontSize: "11px" }}>{title}</span>
      </div>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mono shrink-0 mt-0.5" style={{ color: "var(--text-faint)", fontSize: "12px" }}>
                {i + 1}.
              </span>
              <span style={{ fontSize: "14px", color: "var(--text-bright)", lineHeight: 1.55 }}>
                {item.replace(/\*\*/g, "")}
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: "var(--text-faint)", fontSize: "13px", fontStyle: "italic" }}>
            {emptyText}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="card" style={{ padding: "22px 24px" }}>
      <span className="label block mb-2">{label}</span>
      <span className="metric" style={{ fontSize: "24px", color: value ? "var(--text-bright)" : "var(--text-faint)" }}>
        {value !== null && value !== undefined ? value : "—"}
      </span>
    </div>
  );
}
