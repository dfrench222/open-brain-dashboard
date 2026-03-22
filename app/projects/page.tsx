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

      <h1 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        Projects
        <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>{projects.length} total</span>
      </h1>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{project.name}</span>
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
                <span className="text-xs block mt-1.5" style={{ color: "var(--text-muted)" }}>{project.description}</span>
                <span className="text-xs block mt-1" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}>
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
