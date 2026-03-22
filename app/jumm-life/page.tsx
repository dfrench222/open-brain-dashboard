"use client";

import React from "react";
import CommandBar from "@/components/CommandBar";
import PendingState from "@/components/ui/PendingState";

export default function JummLifePage() {
  return (
    <div>
      <CommandBar />

      <h1
        className="text-lg font-semibold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Jumm Life
      </h1>

      {/* Key People */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
          Family
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Penny */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "rgba(168,85,247,0.12)", color: "var(--neon-purple)", border: "1px solid rgba(168,85,247,0.25)" }}
              >
                PF
              </div>
              <div>
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>Penelope (Penny)</span>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>Rome, Italy &middot; RIS Year 11</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                <span className="kpi-label block mb-1" style={{ fontSize: "0.6rem" }}>Monthly Total</span>
                <span className="text-lg font-bold metric-value" style={{ color: "var(--neon-blue)" }}>$10,596</span>
              </div>
              <div className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                <span className="kpi-label block mb-1" style={{ fontSize: "0.6rem" }}>Allowance</span>
                <span className="text-lg font-bold metric-value" style={{ color: "var(--accent)" }}>$650</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href="tel:+393314772479"
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                style={{ background: "rgba(34,197,94,0.08)", color: "var(--neon-green)", border: "1px solid rgba(34,197,94,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                Call
              </a>
              <a
                href="https://wa.me/393314772479"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                style={{ background: "rgba(37,211,102,0.08)", color: "#25D366", border: "1px solid rgba(37,211,102,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Caitlin */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "rgba(239,68,68,0.12)", color: "var(--neon-red)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                CF
              </div>
              <div>
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>Caitlin French</span>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>Wife &middot; Birthday May 28</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href="tel:8602622226"
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                style={{ background: "rgba(34,197,94,0.08)", color: "var(--neon-green)", border: "1px solid rgba(34,197,94,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                Call
              </a>
              <a
                href="sms:8602622226"
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                style={{ background: "rgba(59,130,246,0.08)", color: "var(--neon-blue)", border: "1px solid rgba(59,130,246,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Finances */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
          Finances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <span className="kpi-label block mb-2">Restitution Balance</span>
            <span className="text-2xl font-bold block metric-value" style={{ color: "var(--neon-purple)", textShadow: "0 0 10px rgba(168,85,247,0.3)" }}>~$8.4M</span>
            <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
              Original: $9,188,038.63 &middot; Est. paid: ~$750K
            </span>
          </div>
          <div className="glass-card p-5">
            <span className="kpi-label block mb-2">Penny Expenses</span>
            <span className="text-2xl font-bold block metric-value" style={{ color: "var(--neon-blue)", textShadow: "0 0 10px rgba(59,130,246,0.3)" }}>$10,596</span>
            <span className="text-xs mt-1 block" style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}>
              $5,468-5,800 support + $2,436 tuition + $650 allowance + $500 college fund
            </span>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
          Calendar
        </h2>
        <PendingState
          label="Connect Google Calendar for live schedule"
          connectLabel="Needs Google service account setup"
        />
      </section>
    </div>
  );
}
