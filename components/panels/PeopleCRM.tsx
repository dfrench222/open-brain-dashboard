"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface Person {
  id: string;
  name: string;
  role: string;
  relationship: string;
  phone: string | null;
  location: string | null;
  workspace: string[];
  interaction_count: number;
  notes: string | null;
}

const relationshipColors: Record<string, string> = {
  "business-partner": "var(--neon-blue)",
  family: "var(--neon-green)",
  mentor: "var(--neon-purple)",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRelationship(rel: string): string {
  return rel
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const fallbackPeople: Person[] = [
  { id: "1", name: "Brixton Albert", role: "CEO, Performance Golf", relationship: "business-partner", phone: null, location: null, workspace: ["performance-golf"], interaction_count: 28853, notes: null },
  { id: "2", name: "Caitlin French", role: "Wife", relationship: "family", phone: null, location: null, workspace: ["jumm-life"], interaction_count: 25440, notes: null },
  { id: "3", name: "Rich Schefren", role: "Mentor & Advisor", relationship: "mentor", phone: null, location: null, workspace: ["jumm-life"], interaction_count: 10627, notes: null },
  { id: "4", name: "Brian French", role: "Brother", relationship: "family", phone: null, location: null, workspace: ["jumm-life"], interaction_count: 8536, notes: null },
  { id: "5", name: "Penelope Rose French", role: "Daughter", relationship: "family", phone: null, location: "Rome, Italy", workspace: ["jumm-life"], interaction_count: 0, notes: null },
];

export default function PeopleCRM() {
  const [people, setPeople] = useState<Person[]>(fallbackPeople);

  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPeople(data);
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  return (
    <GlassCard delay={600}>
      <div className="flex items-center gap-3 mb-8">
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
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{
            color: "var(--neon-green)",
            background: "rgba(34,197,94,0.08)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
          }}
        >
          {people.length}
        </span>
      </div>

      <div className="space-y-4">
        {people.map((person) => {
          const color = relationshipColors[person.relationship] || "var(--neon-cyan)";
          return (
            <div
              key={person.id}
              className="flex items-center gap-4 p-5 rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: `${color}15`,
                  color: color,
                  border: `1px solid ${color}30`,
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.6rem",
                }}
              >
                {getInitials(person.name)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                  {person.name}
                </span>
                <span className="text-xs block mt-1" style={{ color: "var(--text-muted)" }}>
                  {person.role}
                  {person.location && ` — ${person.location}`}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className="text-xs block"
                  style={{ color: color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
                >
                  {formatRelationship(person.relationship)}
                </span>
                {person.interaction_count > 0 && (
                  <span
                    className="text-xs block mt-1"
                    style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
                  >
                    {person.interaction_count.toLocaleString()} msgs
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
