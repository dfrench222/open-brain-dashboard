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

const relationshipBg: Record<string, string> = {
  "business-partner": "rgba(59,130,246,0.1)",
  family: "rgba(34,197,94,0.1)",
  mentor: "rgba(168,85,247,0.1)",
};

const relationshipBorder: Record<string, string> = {
  "business-partner": "rgba(59,130,246,0.2)",
  family: "rgba(34,197,94,0.2)",
  mentor: "rgba(168,85,247,0.2)",
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

      <div className="flex items-center gap-3 mb-8">
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          People
        </h1>
        <span
          className="metric-value"
          style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
        >
          {people.length} contacts
        </span>
      </div>

      <div className="space-y-4">
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
              <div className="flex items-center gap-4 p-5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0"
                  style={{
                    background: relationshipBg[person.relationship] || "rgba(0,255,200,0.1)",
                    color,
                    border: `1px solid ${relationshipBorder[person.relationship] || "rgba(0,255,200,0.2)"}`,
                    fontSize: "0.7rem",
                  }}
                >
                  {getInitials(person.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                    {person.name}
                  </span>
                  <span className="text-xs block mt-1" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {person.role}{person.location ? ` -- ${person.location}` : ""}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="block metric-value"
                    style={{ color, fontSize: "0.65rem" }}
                  >
                    {formatRel(person.relationship)}
                  </span>
                  {person.interaction_count > 0 && (
                    <span
                      className="block mt-1 metric-value"
                      style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                    >
                      {person.interaction_count.toLocaleString()} msgs
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div
                  className="px-5 pb-5"
                  style={{ borderTop: "1px solid var(--border)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pt-4 flex items-center gap-2 flex-wrap">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="action-btn"
                        style={{
                          color: "var(--neon-green)",
                          background: "rgba(34,197,94,0.06)",
                          borderColor: "rgba(34,197,94,0.15)",
                        }}
                      >
                        Call
                      </a>
                    )}
                    {phone && (
                      <a
                        href={`sms:${phone}`}
                        className="action-btn"
                        style={{
                          color: "var(--neon-blue)",
                          background: "rgba(59,130,246,0.06)",
                          borderColor: "rgba(59,130,246,0.15)",
                        }}
                      >
                        Message
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                        style={{
                          color: "#25D366",
                          background: "rgba(37,211,102,0.06)",
                          borderColor: "rgba(37,211,102,0.15)",
                        }}
                      >
                        WhatsApp
                      </a>
                    )}
                    {person.notes && (
                      <span
                        className="text-xs ml-2 italic"
                        style={{ color: "var(--text-muted)" }}
                      >
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
    </div>
  );
}
