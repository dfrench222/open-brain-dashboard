"use client";

import React, { useEffect, useState } from "react";
import CommandBar from "@/components/CommandBar";
import StatusBadge from "@/components/ui/StatusBadge";

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
  critical: "var(--neon-red)",
  high: "var(--neon-amber)",
  medium: "var(--accent)",
  low: "var(--text-muted)",
};

const priorityLabels: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function mapStatus(status: string): "active" | "planning" | "building" | "paused" | "completed" {
  if (status === "active") return "active";
  if (status === "paused") return "paused";
  if (status === "completed") return "completed";
  return "active";
}

const fallbackProjects: Project[] = [
  { id: "1", name: "Performance Golf", description: "Direct response golf company -- $164M target", status: "active", priority: "critical", workspace: "performance-golf", owner: "Don French" },
  { id: "2", name: "Open Brain", description: "Life Operating System dashboard", status: "active", priority: "critical", workspace: "shared", owner: "Don French" },
  { id: "3", name: "De French 2.0", description: "Personal brand, speaking, consulting", status: "active", priority: "high", workspace: "jumm-life", owner: "Don French" },
  { id: "4", name: "Perfect Pitch Publishing", description: "Publishing venture", status: "active", priority: "medium", workspace: "jumm-life", owner: "Don French" },
  { id: "5", name: "Freedom Factor", description: "Prison reform initiative", status: "paused", priority: "medium", workspace: "jumm-life", owner: "Don French" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
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
          Projects
        </h1>
        <span
          className="metric-value"
          style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
        >
          {projects.length} total
        </span>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="glass-card" style={{ padding: "24px" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {project.name}
                  </span>
                  {project.priority && (
                    <span
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: priorityColors[project.priority] || "var(--text-muted)",
                          boxShadow: project.priority === "critical"
                            ? `0 0 6px ${priorityColors[project.priority]}`
                            : "none",
                        }}
                      />
                      <span
                        className="metric-value"
                        style={{
                          color: priorityColors[project.priority],
                          fontSize: "0.6rem",
                        }}
                      >
                        {priorityLabels[project.priority]}
                      </span>
                    </span>
                  )}
                </div>
                <span
                  className="text-sm block leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.description}
                </span>
                <span
                  className="metric-value block mt-2"
                  style={{ color: "var(--text-muted)", fontSize: "0.6rem", opacity: 0.6 }}
                >
                  {project.workspace}
                </span>
              </div>
              <div className="shrink-0">
                <StatusBadge status={mapStatus(project.status)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
