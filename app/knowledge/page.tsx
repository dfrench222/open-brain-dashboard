"use client";

import React, { useEffect, useState } from "react";
import CommandBar from "@/components/CommandBar";

interface BrainStats {
  thoughts: number | null;
  people: number | null;
  projects: number | null;
  quotes: number | null;
}

export default function KnowledgePage() {
  const [stats, setStats] = useState<BrainStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brain-stats")
      .then((res) => res.json())
      .then((data) => { if (!data.error) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasData = stats && (stats.thoughts !== null || stats.people !== null);

  const integrations = [
    { name: "Supabase (Second Brain)", status: hasData ? "Connected" : "Not connected", connected: !!hasData },
    { name: "Limitless Life Log", status: "Daily sync (10 AM)", connected: true },
    { name: "Obsidian Backup", status: "Every 6 hours", connected: true },
    { name: "QuickBooks", status: "Not connected", connected: false },
    { name: "DOMO (PG Metrics)", status: "Not connected", connected: false },
    { name: "Google Calendar", status: "Not connected", connected: false },
  ];

  return (
    <div>
      <CommandBar />

      <h1
        className="text-lg font-semibold mb-8"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Knowledge Base
      </h1>

      {/* Stats */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">Supabase Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="glass-card animate-fade-in-up"
                style={{ padding: "24px", animationDelay: `${i * 100}ms`, opacity: 0 }}
              >
                <span className="kpi-label block mb-3">Loading...</span>
                <div className="h-6 w-12 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            ))
          ) : hasData ? (
            <>
              <StatBox label="Thoughts" value={stats!.thoughts} color="var(--accent)" delay={0} />
              <StatBox label="People Indexed" value={stats!.people} color="var(--neon-green)" delay={1} />
              <StatBox label="Projects" value={stats!.projects} color="var(--neon-blue)" delay={2} />
              <StatBox label="Daily Quotes" value={stats!.quotes} color="var(--neon-purple)" delay={3} />
            </>
          ) : (
            [1, 2, 3, 4].map((i) => {
              const labels = ["Thoughts", "People", "Projects", "Quotes"];
              return (
                <div
                  key={i}
                  className="text-center animate-fade-in-up"
                  style={{
                    padding: "24px",
                    border: "1px dashed rgba(179,170,163,0.12)",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.01)",
                    animationDelay: `${i * 100}ms`,
                    opacity: 0,
                  }}
                >
                  <span
                    className="text-sm block italic mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Pending
                  </span>
                  <span className="kpi-label">{labels[i - 1]}</span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Integration Status */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">Integration Status</h2>
        <div className="space-y-3">
          {integrations.map((item, idx) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 rounded-xl animate-fade-in-up"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: item.connected
                  ? "1px solid var(--glass-border)"
                  : "1px dashed rgba(179,170,163,0.12)",
                animationDelay: `${idx * 80}ms`,
                opacity: 0,
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: item.connected ? "var(--text-secondary)" : "var(--text-muted)",
                }}
              >
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="metric-value"
                  style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
                >
                  {item.status}
                </span>
                {item.connected && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number | null;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: "24px",
        animationDelay: `${delay * 100}ms`,
        opacity: 0,
      }}
    >
      <span className="kpi-label block mb-3">{label}</span>
      {value !== null ? (
        <span
          className="text-2xl font-bold block metric-value"
          style={{ color, textShadow: `0 0 12px ${color}25` }}
        >
          {value.toLocaleString()}
        </span>
      ) : (
        <span
          className="text-lg block italic"
          style={{ color: "var(--text-muted)", opacity: 0.5 }}
        >
          N/A
        </span>
      )}
    </div>
  );
}
