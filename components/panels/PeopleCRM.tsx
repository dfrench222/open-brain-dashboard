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
  whatsapp?: string | null;
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

// Known contacts with real phone/WhatsApp info
const contactInfo: Record<string, { phone?: string; whatsapp?: string }> = {
  "Brixton Albert": { phone: "7178217833" },
  "Caitlin French": { phone: "8602622226" },
  "Brian French": { phone: "2485682969" },
  "Don French Sr": { phone: "2488424519" },
  "Penelope Rose French": { phone: "+393314772479", whatsapp: "393314772479" },
};

const fallbackPeople: Person[] = [
  { id: "1", name: "Brixton Albert", role: "CEO, Performance Golf", relationship: "business-partner", phone: "7178217833", location: null, workspace: ["performance-golf"], interaction_count: 28853, notes: null },
  { id: "2", name: "Caitlin French", role: "Wife", relationship: "family", phone: "8602622226", location: null, workspace: ["jumm-life"], interaction_count: 25440, notes: null },
  { id: "3", name: "Rich Schefren", role: "Mentor & Advisor", relationship: "mentor", phone: null, location: null, workspace: ["jumm-life"], interaction_count: 10627, notes: null },
  { id: "4", name: "Brian French", role: "Brother", relationship: "family", phone: "2485682969", location: "Michigan", workspace: ["jumm-life"], interaction_count: 8536, notes: null },
  { id: "5", name: "Penelope Rose French", role: "Daughter", relationship: "family", phone: "+393314772479", location: "Rome, Italy", workspace: ["jumm-life"], interaction_count: 0, notes: null, whatsapp: "393314772479" },
];

export default function PeopleCRM() {
  const [people, setPeople] = useState<Person[]>(fallbackPeople);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Enrich with known contact info
          const enriched = data.map((p: Person) => {
            const info = contactInfo[p.name];
            return {
              ...p,
              phone: p.phone || info?.phone || null,
              whatsapp: info?.whatsapp || null,
            };
          });
          setPeople(enriched);
        }
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

      <div className="space-y-3">
        {people.map((person) => {
          const color = relationshipColors[person.relationship] || "var(--neon-cyan)";
          const isExpanded = expandedId === person.id;
          const phone = person.phone || contactInfo[person.name]?.phone;
          const whatsapp = person.whatsapp || contactInfo[person.name]?.whatsapp;

          return (
            <div
              key={person.id}
              className="rounded-xl transition-all duration-200 cursor-pointer"
              style={{
                background: isExpanded ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                border: "1px solid var(--glass-border)",
              }}
              onClick={() => toggle(person.id)}
            >
              {/* Collapsed row */}
              <div className="flex items-center gap-4 p-4">
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
                  <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {person.role}
                    {person.location && ` — ${person.location}`}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
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
                  <span
                    className="text-xs shrink-0 transition-transform duration-200"
                    style={{
                      color: "var(--text-muted)",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    &#9656;
                  </span>
                </div>
              </div>

              {/* Expanded actions */}
              {isExpanded && (
                <div
                  className="px-4 pb-4 pt-0"
                  style={{ borderTop: "1px solid var(--glass-border)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pt-3 flex items-center gap-2 flex-wrap">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                        style={{
                          color: "var(--neon-green)",
                          background: "rgba(34,197,94,0.08)",
                          border: "1px solid rgba(34,197,94,0.15)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Call
                      </a>
                    )}
                    {phone && (
                      <a
                        href={`sms:${phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                        style={{
                          color: "var(--neon-blue)",
                          background: "rgba(59,130,246,0.08)",
                          border: "1px solid rgba(59,130,246,0.15)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Message
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                        style={{
                          color: "#25D366",
                          background: "rgba(37,211,102,0.08)",
                          border: "1px solid rgba(37,211,102,0.15)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.548 4.101 1.51 5.83L0 24l6.327-1.461A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.63-.5-5.146-1.38l-.369-.219-3.826.883.953-3.48-.24-.382A9.698 9.698 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75S21.75 6.615 21.75 12s-4.365 9.75-9.75 9.75z" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    {person.notes && (
                      <span className="text-xs ml-2" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                        {person.notes}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
