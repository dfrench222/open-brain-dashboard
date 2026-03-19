"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

const stats = [
  { label: "Captures Today", value: "47", color: "var(--neon-cyan)" },
  { label: "KB Documents", value: "1,284", color: "var(--neon-purple)" },
  { label: "Distilled Notes", value: "312", color: "var(--neon-blue)" },
  { label: "People Indexed", value: "89", color: "var(--neon-green)" },
];

const syncs = [
  { name: "Limitless Life Log", time: "10:00 AM", status: "synced" },
  { name: "Daily Insights", time: "10:05 AM", status: "synced" },
  { name: "Obsidian Backup", time: "6:00 AM", status: "synced" },
  { name: "Distillation Pipeline", time: "10:15 AM", status: "synced" },
];

export default function AIActivity() {
  return (
    <GlassCard delay={700}>
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
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
        <span
          className="ml-auto flex items-center gap-1.5 text-xs"
          style={{ color: "var(--neon-green)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
          />
          All Systems Online
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
          >
            <span
              className="text-2xl font-bold block mb-1"
              style={{
                color: stat.color,
                fontFamily: "'JetBrains Mono', monospace",
                textShadow: `0 0 10px ${stat.color}30`,
              }}
            >
              {stat.value}
            </span>
            <span
              className="text-xs mt-2 block"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Sync status */}
      <div className="mt-6">
        <span
          className="text-xs uppercase tracking-wider block mb-4"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
        >
          Last Sync Times
        </span>
        <div className="space-y-3">
          {syncs.map((sync) => (
            <div
              key={sync.name}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {sync.name}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
                >
                  {sync.time}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
