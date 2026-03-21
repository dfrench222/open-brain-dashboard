"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

/* Pending connection placeholder */
function PendingMetric({ label, connectLabel }: { label: string; connectLabel: string }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(179, 170, 163, 0.15)",
      }}
    >
      <span
        className="text-xs uppercase tracking-wider block mb-3"
        style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <span
        className="text-sm block italic"
        style={{ color: "var(--text-muted)" }}
      >
        Pending connection
      </span>
      <span
        className="text-xs mt-2 flex items-center gap-1.5"
        style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        {connectLabel}
      </span>
    </div>
  );
}

/* Verified metric card */
function VerifiedMetric({ label, value, subtext, color }: { label: string; value: string; subtext?: string; color: string }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <span
        className="text-xs uppercase tracking-wider block mb-3"
        style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold block metric-value"
        style={{
          color,
          textShadow: `0 0 15px ${color}30`,
        }}
      >
        {value}
      </span>
      {subtext && (
        <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
          {subtext}
        </span>
      )}
    </div>
  );
}

export default function FinancialOverview() {
  return (
    <GlassCard delay={200}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
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

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
        {/* Monthly Income — PENDING: no QuickBooks connected */}
        <PendingMetric label="Monthly Income" connectLabel="Connect QuickBooks" />

        {/* Monthly Expenses — PENDING: no QuickBooks connected */}
        <PendingMetric label="Monthly Expenses" connectLabel="Connect QuickBooks" />

        {/* Restitution Balance — estimated from court records */}
        <div
          className="p-5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <span
            className="text-xs uppercase tracking-wider block mb-3"
            style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em" }}
          >
            Restitution Bal.
          </span>
          <span
            className="text-2xl font-bold block metric-value"
            style={{
              color: "var(--neon-purple)",
              textShadow: "0 0 15px rgba(168,85,247,0.3)",
            }}
          >
            ~$8.4M
          </span>
          <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)", fontSize: "0.55rem", lineHeight: "1.4" }}>
            Estimated &mdash; request exact balance from Clerk of Courts
          </span>
          <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)", fontSize: "0.5rem", fontStyle: "italic" }}>
            Original: $9,188,038.63 &middot; Est. paid: ~$750K
          </span>
        </div>

        {/* Penny Expenses — VERIFIED from Don's records */}
        <VerifiedMetric
          label="Penny Expenses"
          value="$10,596"
          subtext="Support + Tuition + Fund"
          color="var(--neon-blue)"
        />
      </div>

      {/* Net Monthly — REMOVED: cannot calculate without real income/expense data */}
    </GlassCard>
  );
}
