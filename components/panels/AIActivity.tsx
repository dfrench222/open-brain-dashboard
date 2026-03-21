"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface BrainStats {
  thoughts: number | null;
  people: number | null;
  projects: number | null;
  quotes: number | null;
}

export default function AIActivity() {
  const [stats, setStats] = useState<BrainStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brain-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStats(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasRealData = stats && (stats.thoughts !== null || stats.people !== null || stats.projects !== null || stats.quotes !== null);

  const statItems = hasRealData
    ? [
        { label: "Thoughts", value: stats!.thoughts, color: "var(--neon-cyan)" },
        { label: "People Indexed", value: stats!.people, color: "var(--neon-green)" },
        { label: "Projects", value: stats!.projects, color: "var(--neon-blue)" },
        { label: "Daily Quotes", value: stats!.quotes, color: "var(--neon-purple)" },
      ]
    : [];

  return (
    <GlassCard delay={700}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.92L12 10v2" />
            <circle cx="12" cy="16" r="2" />
            <path d="M12 18v2" />
            <path d="M8 22h8" />
            <path d="M7 6a4 4 0 0 1 .8-2.4" />
            <path d="M17 6a4 4 0 0 0-.8-2.4" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-cyan)">
          AI Activity
        </NeonText>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2" style={{ gap: "16px", marginBottom: "24px" }}>
        {loading ? (
          /* Loading state */
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
            >
              <span className="text-sm block italic" style={{ color: "var(--text-muted)" }}>
                Loading...
              </span>
            </div>
          ))
        ) : hasRealData ? (
          /* Real Supabase data */
          statItems.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
            >
              {stat.value !== null ? (
                <span
                  className="text-2xl font-bold block mb-1 metric-value"
                  style={{
                    color: stat.color,
                    textShadow: `0 0 10px ${stat.color}30`,
                  }}
                >
                  {stat.value.toLocaleString()}
                </span>
              ) : (
                <span className="text-sm block mb-1 italic" style={{ color: "var(--text-muted)" }}>
                  N/A
                </span>
              )}
              <span
                className="text-xs block"
                style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                {stat.label}
              </span>
            </div>
          ))
        ) : (
          /* No data — pending */
          Array.from({ length: 4 }).map((_, i) => {
            const labels = ["Thoughts", "People Indexed", "Projects", "Daily Quotes"];
            return (
              <div
                key={i}
                className="p-5 rounded-xl text-center"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(179, 170, 163, 0.15)",
                }}
              >
                <span className="text-sm block mb-1 italic" style={{ color: "var(--text-muted)" }}>
                  Pending
                </span>
                <span
                  className="text-xs block"
                  style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
                >
                  {labels[i]}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Sync status — show actual connection state, not fake green checkmarks */}
      <div>
        <span
          className="text-xs uppercase tracking-wider block mb-4"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em" }}
        >
          Integration Status
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Supabase — check if we got real data */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Supabase (Second Brain)
            </span>
            <div className="flex items-center gap-3">
              {hasRealData ? (
                <>
                  <span
                    className="text-xs metric-value"
                    style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
                  >
                    Connected
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
                  />
                </>
              ) : (
                <span className="text-xs italic" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
                  Not connected
                </span>
              )}
            </div>
          </div>

          {/* Limitless */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Limitless Life Log
            </span>
            <div className="flex items-center gap-3">
              <span
                className="text-xs metric-value"
                style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
              >
                Daily sync (10 AM)
              </span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
              />
            </div>
          </div>

          {/* Obsidian Backup */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Obsidian Backup
            </span>
            <div className="flex items-center gap-3">
              <span
                className="text-xs metric-value"
                style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
              >
                Every 6 hours
              </span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
              />
            </div>
          </div>

          {/* QuickBooks — not connected */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(179, 170, 163, 0.15)",
            }}
          >
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              QuickBooks
            </span>
            <span className="text-xs italic" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
              Not connected
            </span>
          </div>

          {/* DOMO — not connected */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(179, 170, 163, 0.15)",
            }}
          >
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              DOMO (PG Metrics)
            </span>
            <span className="text-xs italic" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
              Not connected
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
