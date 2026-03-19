"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";
import StatusBadge from "../ui/StatusBadge";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
  priority: "critical" | "high" | "medium" | "low";
  workspace: string;
  owner: string;
}

const priorityColors: Record<string, string> = {
  critical: "var(--neon-red, #ef4444)",
  high: "var(--neon-amber)",
  medium: "var(--neon-cyan)",
  low: "var(--text-muted)",
};

// Map DB status values to StatusBadge values
function mapStatus(status: string): "active" | "planning" | "building" | "paused" | "completed" {
  if (status === "active") return "active";
  if (status === "paused") return "paused";
  if (status === "completed") return "completed";
  return "active";
}

const fallbackProjects: Project[] = [
  { id: "1", name: "Performance Golf", description: "Direct response golf company — $164M target", status: "active", priority: "critical", workspace: "performance-golf", owner: "Don French" },
  { id: "2", name: "Open Brain", description: "Life Operating System dashboard", status: "active", priority: "critical", workspace: "shared", owner: "Don French" },
  { id: "3", name: "De French 2.0", description: "Personal brand, speaking, consulting", status: "active", priority: "high", workspace: "jumm-life", owner: "Don French" },
  { id: "4", name: "Perfect Pitch Publishing", description: "Publishing venture", status: "active", priority: "medium", workspace: "jumm-life", owner: "Don French" },
  { id: "5", name: "Freedom Factor", description: "Prison reform initiative", status: "paused", priority: "medium", workspace: "jumm-life", owner: "Don French" },
];

export default function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

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
            key={project.id}
            className="p-3 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {project.name}
                  </span>
                  {project.priority && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background: priorityColors[project.priority] || "var(--text-muted)",
                        boxShadow: project.priority === "critical" ? `0 0 6px ${priorityColors[project.priority]}` : "none",
                      }}
                      title={`${project.priority} priority`}
                    />
                  )}
                </div>
                <span className="text-xs block mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {project.description}
                </span>
              </div>
              <StatusBadge status={mapStatus(project.status)} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
