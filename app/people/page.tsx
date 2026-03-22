"use client";

import React, { useEffect, useState } from "react";
import CommandBar from "@/components/CommandBar";

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

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatRel(rel: string): string {
  return rel.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>(fallbackPeople);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((p: Person) => {
            const info = contactInfo[p.name];
            return { ...p, phone: p.phone || info?.phone || null, whatsapp: info?.whatsapp || null };
          });
          setPeople(enriched);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <CommandBar />

      <h1 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        People
        <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>{people.length} contacts</span>
      </h1>

      <div className="space-y-3">
        {people.map((person) => {
          const color = relationshipColors[person.relationship] || "var(--accent)";
          const isExpanded = expandedId === person.id;
          const phone = person.phone || contactInfo[person.name]?.phone;
          const whatsapp = person.whatsapp || contactInfo[person.name]?.whatsapp;

          return (
            <div
              key={person.id}
              className="glass-card transition-all duration-200 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : person.id)}
            >
              <div className="flex items-center gap-4 p-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${color}12`, color, border: `1px solid ${color}25`, fontSize: "0.65rem" }}
                >
                  {getInitials(person.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>{person.name}</span>
                  <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {person.role}{person.location ? ` -- ${person.location}` : ""}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs block" style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
                    {formatRel(person.relationship)}
                  </span>
                  {person.interaction_count > 0 && (
                    <span className="text-xs block mt-1" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}>
                      {person.interaction_count.toLocaleString()} msgs
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
                  <div className="pt-3 flex items-center gap-2 flex-wrap">
                    {phone && (
                      <a href={`tel:${phone}`} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--neon-green)", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
                        Call
                      </a>
                    )}
                    {phone && (
                      <a href={`sms:${phone}`} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--neon-blue)", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
                        Message
                      </a>
                    )}
                    {whatsapp && (
                      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "#25D366", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
                        WhatsApp
                      </a>
                    )}
                    {person.notes && (
                      <span className="text-xs ml-2 italic" style={{ color: "var(--text-muted)" }}>{person.notes}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
