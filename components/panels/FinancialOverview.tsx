"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  color: string;
  trend?: "up" | "down" | "flat";
}

function MetricCard({ label, value, subtext, color, trend }: MetricCardProps) {
  const trendIcon = trend === "up" ? "\u2191" : trend === "down" ? "\u2193" : "\u2192";
  const trendColor =
    trend === "up" ? "var(--neon-green)" : trend === "down" ? "var(--neon-red)" : "var(--text-muted)";

  return (
    <div
      className="p-5 rounded-xl transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
        >
          {label}
        </span>
        {trend && (
          <span className="text-sm font-bold" style={{ color: trendColor }}>
            {trendIcon}
          </span>
        )}
      </div>
      <div
        className="text-2xl font-bold tracking-tight whitespace-nowrap"
        style={{
          color,
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: `0 0 15px ${color}30`,
        }}
      >
        {value}
      </div>
      {subtext && (
        <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)" }}>
          {subtext}
        </span>
      )}
    </div>
  );
}

export default function FinancialOverview() {
  return (
    <GlassCard delay={200}>
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-cyan)">
          Financial Overview
        </NeonText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Monthly Income"
          value="$112K"
          subtext="Performance Golf"
          color="var(--neon-green)"
          trend="up"
        />
        <MetricCard
          label="Monthly Expenses"
          value="$78.5K"
          subtext="All categories"
          color="var(--neon-amber)"
          trend="flat"
        />
        <MetricCard
          label="Restitution Bal."
          value="$1.24M"
          subtext="Monthly payments active"
          color="var(--neon-purple)"
          trend="down"
        />
        <MetricCard
          label="Penny Expenses"
          value="$10,596"
          subtext="Support + Tuition + Fund"
          color="var(--neon-blue)"
          trend="flat"
        />
      </div>

      {/* Net trend */}
      <div
        className="mt-6 p-5 rounded-xl flex items-center justify-between gap-4"
        style={{
          background: "rgba(34,197,94,0.05)",
          border: "1px solid rgba(34,197,94,0.1)",
        }}
      >
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
          Net Monthly
        </span>
        <span
          className="text-lg font-bold whitespace-nowrap shrink-0"
          style={{
            color: "var(--neon-green)",
            fontFamily: "'JetBrains Mono', monospace",
            textShadow: "0 0 10px rgba(34,197,94,0.3)",
          }}
        >
          +$33.5K <span className="text-sm">\u2191</span>
        </span>
      </div>
    </GlassCard>
  );
}
