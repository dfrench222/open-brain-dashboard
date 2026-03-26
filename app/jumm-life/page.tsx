"use client";

import React from "react";
import CommandBar from "@/components/CommandBar";
import PendingState from "@/components/ui/PendingState";

export default function JummLifePage() {
  return (
    <div>
      <CommandBar />

      <h1
        className="text-lg font-semibold mb-8"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Jumm Life
      </h1>

      {/* Family */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">Family</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Penny */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  color: "var(--neon-purple)",
                  border: "1px solid rgba(168,85,247,0.2)",
                  fontSize: "0.7rem",
                }}
              >
                PF
              </div>
              <div>
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                  Penelope (Penny)
                </span>
                <span
                  className="text-xs block mt-0.5"
                  style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
                >
                  Rome, Italy &middot; RIS Year 11
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
              >
                <span className="kpi-label block mb-2" style={{ fontSize: "0.6rem" }}>Monthly Total</span>
                <span className="text-lg font-bold metric-value" style={{ color: "var(--neon-blue)" }}>
                  $10,596
                </span>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
              >
                <span className="kpi-label block mb-2" style={{ fontSize: "0.6rem" }}>Allowance</span>
                <span className="text-lg font-bold metric-value" style={{ color: "var(--accent)" }}>
                  $650
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href="tel:+393314772479"
                className="action-btn"
                style={{
                  background: "rgba(34,197,94,0.06)",
                  color: "var(--neon-green)",
                  borderColor: "rgba(34,197,94,0.15)",
                }}
              >
                Call
              </a>
              <a
                href="https://wa.me/393314772479"
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn"
                style={{
                  background: "rgba(37,211,102,0.06)",
                  color: "#25D366",
                  borderColor: "rgba(37,211,102,0.15)",
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Caitlin */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "var(--neon-red)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: "0.7rem",
                }}
              >
                CF
              </div>
              <div>
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                  Caitlin French
                </span>
                <span
                  className="text-xs block mt-0.5"
                  style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
                >
                  Wife &middot; Birthday May 28
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href="tel:8602622226"
                className="action-btn"
                style={{
                  background: "rgba(34,197,94,0.06)",
                  color: "var(--neon-green)",
                  borderColor: "rgba(34,197,94,0.15)",
                }}
              >
                Call
              </a>
              <a
                href="sms:8602622226"
                className="action-btn"
                style={{
                  background: "rgba(59,130,246,0.06)",
                  color: "var(--neon-blue)",
                  borderColor: "rgba(59,130,246,0.15)",
                }}
              >
                Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Finances */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">Finances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="glass-card" style={{ padding: "24px" }}>
            <span className="kpi-label block mb-3">Restitution Balance</span>
            <span
              className="text-2xl font-bold block metric-value"
              style={{ color: "var(--neon-purple)", textShadow: "0 0 12px rgba(168,85,247,0.25)" }}
            >
              ~$8.4M
            </span>
            <span
              className="text-xs mt-2 block"
              style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
            >
              Original: $9,188,038.63 &middot; Est. paid: ~$750K
            </span>
          </div>
          <div className="glass-card" style={{ padding: "24px" }}>
            <span className="kpi-label block mb-3">Penny Expenses</span>
            <span
              className="text-2xl font-bold block metric-value"
              style={{ color: "var(--neon-blue)", textShadow: "0 0 12px rgba(59,130,246,0.25)" }}
            >
              $10,596
            </span>
            <span
              className="text-xs mt-2 block leading-relaxed"
              style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
            >
              $5,468-5,800 support + $2,436 tuition + $650 allowance + $500 college fund
            </span>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">Calendar</h2>
        <PendingState
          label="Connect Google Calendar for live schedule"
          connectLabel="Needs Google service account setup"
        />
      </section>
    </div>
  );
}
