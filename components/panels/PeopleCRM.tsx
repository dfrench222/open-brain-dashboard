"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

const people = [
  {
    name: "Brixton Albert",
    role: "CEO, Performance Golf",
    relation: "Business Partner",
    color: "var(--neon-blue)",
    initials: "BA",
    lastContact: "Today",
  },
  {
    name: "Ben Marcoux",
    role: "Co-builder",
    relation: "Business Partner",
    color: "var(--neon-cyan)",
    initials: "BM",
    lastContact: "Yesterday",
  },
  {
    name: "Rich Schefren",
    role: "Mentor & Advisor",
    relation: "Mentor",
    color: "var(--neon-purple)",
    initials: "RS",
    lastContact: "2 days ago",
  },
  {
    name: "Brian French",
    role: "Brother",
    relation: "Family",
    color: "var(--neon-green)",
    initials: "BF",
    lastContact: "Today",
  },
  {
    name: "Penny French",
    role: "Daughter — Rome, Italy",
    relation: "Family",
    color: "var(--neon-amber)",
    initials: "PF",
    lastContact: "Yesterday",
  },
];

export default function PeopleCRM() {
  return (
    <GlassCard delay={600}>
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-green)">
          People / CRM
        </NeonText>
      </div>

      <div className="space-y-2">
        {people.map((person) => (
          <div
            key={person.name}
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: `${person.color}15`,
                color: person.color,
                border: `1px solid ${person.color}30`,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.6rem",
              }}
            >
              {person.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                {person.name}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {person.role}
              </span>
            </div>
            <div className="text-right shrink-0">
              <span
                className="text-xs block"
                style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                {person.lastContact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
