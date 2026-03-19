"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";
import ProgressBar from "../ui/ProgressBar";

const launches = [
  { name: "Spring Promo", date: "Mar 25", status: "live" },
  { name: "New VSL Funnel", date: "Apr 8", status: "prep" },
  { name: "Summer Campaign", date: "May 1", status: "planning" },
];

export default function PGCommandCenter() {
  const currentRevenue = 42.3;
  const targetRevenue = 164;

  return (
    <GlassCard delay={300}>
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-blue)">
          PG Command Center
        </NeonText>
      </div>

      {/* Revenue target */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
            2026 REVENUE TARGET
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--neon-blue)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            ${currentRevenue}M / ${targetRevenue}M
          </span>
        </div>
        <ProgressBar
          value={currentRevenue}
          max={targetRevenue}
          color="var(--neon-blue)"
          showValue
          height={10}
        />
      </div>

      {/* Active launches */}
      <div
        className="p-5 rounded-xl mb-7"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}>
            Active Launches
          </span>

          <span
            className="text-xl font-bold"
            style={{ color: "var(--neon-blue)", fontFamily: "'JetBrains Mono', monospace", textShadow: "0 0 10px rgba(59,130,246,0.3)" }}
          >
            3
          </span>
        </div>
      </div>

      {/* Launch calendar */}
      <div>
        <span
          className="text-xs uppercase tracking-wider block mb-3"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
        >
          Launch Calendar
        </span>
        <div className="space-y-3">
          {launches.map((launch) => {
            const statusColor =
              launch.status === "live"
                ? "var(--neon-green)"
                : launch.status === "prep"
                ? "var(--neon-amber)"
                : "var(--text-muted)";

            return (
              <div
                key={launch.name}
                className="flex items-center justify-between p-4 rounded-xl gap-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
                  />
                  <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {launch.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
                  >
                    {launch.date}
                  </span>
                  <span
                    className="text-xs uppercase px-2.5 py-1 rounded shrink-0 whitespace-nowrap"
                    style={{
                      color: statusColor,
                      background: `${statusColor}10`,
                      border: `1px solid ${statusColor}20`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {launch.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
