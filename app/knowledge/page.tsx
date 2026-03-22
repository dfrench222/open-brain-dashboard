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

      <h1 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        Knowledge Base
      </h1>

      {/* Stats */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
          Supabase Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-5 text-center">
                <span className="text-sm block italic" style={{ color: "var(--text-muted)" }}>Loading...</span>
              </div>
            ))
          ) : hasData ? (
            <>
              <StatBox label="Thoughts" value={stats!.thoughts} color="var(--accent)" />
              <StatBox label="People Indexed" value={stats!.people} color="var(--neon-green)" />
              <StatBox label="Projects" value={stats!.projects} color="var(--neon-blue)" />
              <StatBox label="Daily Quotes" value={stats!.quotes} color="var(--neon-purple)" />
            </>
          ) : (
            [1, 2, 3, 4].map((i) => {
              const labels = ["Thoughts", "People", "Projects", "Quotes"];
              return (
                <div key={i} className="glass-card p-5 text-center" style={{ border: "1px dashed rgba(179,170,163,0.15)" }}>
                  <span className="text-sm block italic mb-1" style={{ color: "var(--text-muted)" }}>Pending</span>
                  <span className="text-xs kpi-label">{labels[i - 1]}</span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Integration Status */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
          Integration Status
        </h2>
        <div className="space-y-3">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: item.connected ? "1px solid var(--border)" : "1px dashed rgba(179,170,163,0.15)",
              }}
            >
              <span className="text-sm" style={{ color: item.connected ? "var(--text-secondary)" : "var(--text-muted)" }}>
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs metric-value"
                  style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
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

function StatBox({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div className="glass-card p-5 text-center">
      {value !== null ? (
        <span className="text-2xl font-bold block mb-1 metric-value" style={{ color, textShadow: `0 0 10px ${color}30` }}>
          {value.toLocaleString()}
        </span>
      ) : (
        <span className="text-sm block mb-1 italic" style={{ color: "var(--text-muted)" }}>N/A</span>
      )}
      <span className="text-xs block kpi-label">{label}</span>
    </div>
  );
}
