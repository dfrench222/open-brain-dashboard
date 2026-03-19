"use client";

import React from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";
import StatusBadge from "../ui/StatusBadge";

const projects = [
  { name: "Performance Golf", description: "Direct response golf company — $164M target", status: "active" as const },
  { name: "De French 2.0", description: "Personal brand content & thought leadership", status: "active" as const },
  { name: "Open Brain", description: "Life Operating System dashboard", status: "building" as const },
  { name: "Perfect Pitch Publishing", description: "Publishing venture", status: "active" as const },
  { name: "Freedom Factor", description: "New venture — planning phase", status: "planning" as const },
];

export default function ActiveProjects() {
  return (
    <GlassCard delay={500}>
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-amber)">
          Active Projects
        </NeonText>
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{
            color: "var(--neon-amber)",
            background: "rgba(245,158,11,0.08)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
          }}
        >
          {projects.length}
        </span>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="p-3 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-sm font-medium block" style={{ color: "var(--text-primary)" }}>
                  {project.name}
                </span>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {project.description}
                </span>
              </div>
              <StatusBadge status={project.status} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
