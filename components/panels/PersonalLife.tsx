"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

const events = [
  { name: "Penny's Spring Break", date: "Apr 5-12", type: "family" },
  { name: "Caitlin's Birthday", date: "May 28", type: "family" },
  { name: "Brian Visit — Michigan", date: "May 2-4", type: "travel" },
];

export default function PersonalLife() {
  return (
    <GlassCard delay={400}>
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-purple)">
          Personal Life
        </NeonText>
      </div>

      {/* Key people */}
      <div className="space-y-4 mb-8">
        {/* Penny */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">&#x1F9E1;</span>
              <div>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Penelope (Penny)
                </span>
                <span className="block text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
                  Rome, Italy &middot; RIS Year 11
                </span>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1.5 rounded shrink-0 whitespace-nowrap"
              style={{
                color: "var(--neon-green)",
                background: "rgba(34,197,94,0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
              }}
            >
              All Good
            </span>
          </div>
        </div>

        {/* Caitlin */}
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">&#x2764;&#xFE0F;</span>
            <div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Caitlin French
              </span>
              <span className="block text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Wife
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Health metrics placeholder */}
      <div
        className="p-5 rounded-xl mb-8"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
      >
        <span
          className="text-xs uppercase tracking-wider block mb-4"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
        >
          Health Metrics
        </span>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center py-2">
            <span
              className="text-xl font-bold block mb-1"
              style={{ color: "var(--neon-green)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              7.2K
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>Steps</span>
          </div>
          <div className="text-center py-2">
            <span
              className="text-xl font-bold block mb-1"
              style={{ color: "var(--neon-purple)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              7.5h
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>Sleep</span>
          </div>
          <div className="text-center py-2">
            <span
              className="text-xl font-bold block mb-1"
              style={{ color: "var(--neon-cyan)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              62
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>Resting HR</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="mt-6">
        <span
          className="text-xs uppercase tracking-wider block mb-4"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
        >
          Upcoming
        </span>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.name}
              className="flex items-center justify-between p-4 rounded-xl gap-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                {event.name}
              </span>
              <span
                className="text-xs shrink-0 whitespace-nowrap"
                style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
              >
                {event.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
