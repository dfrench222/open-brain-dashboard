"use client";

import React, { useEffect, useState } from "react";
import CommandBar from "@/components/CommandBar";
import PendingState from "@/components/ui/PendingState";

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  status_color: string;
  due_date: string | null;
  list: string;
  url: string;
}

export default function PerformanceGolfPage() {
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetch("/api/clickup")
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks) {
          setTasks(data.tasks);
          setTotalTasks(data.total || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeTasks = tasks.filter(
    (t) => t.status.toLowerCase() !== "closed" && t.status.toLowerCase() !== "hold for launch"
  );

  return (
    <div>
      <CommandBar />

      <h1
        className="text-lg font-semibold mb-8"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Performance Golf
      </h1>

      {/* Revenue */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">Revenue</h2>
        <PendingState
          label="PG revenue metrics pending connection"
          connectLabel="Connect DOMO for real-time data"
        />
      </section>

      {/* Active Tasks */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="section-heading">ClickUp Tasks</h2>
          {totalTasks > 0 && (
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(59,130,246,0.1)",
                color: "var(--neon-blue)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 600,
              }}
            >
              {totalTasks}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl p-5 animate-fade-in-up"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid var(--glass-border)",
                  animationDelay: `${i * 100}ms`,
                  opacity: 0,
                }}
              >
                <div className="h-4 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            ))}
          </div>
        ) : activeTasks.length > 0 ? (
          <div className="space-y-3">
            {activeTasks.map((task) => {
              const statusLower = task.status.toLowerCase();
              const statusColor =
                statusLower === "in progress"
                  ? "var(--neon-green)"
                  : statusLower === "ready"
                  ? "var(--neon-amber)"
                  : "var(--text-muted)";
              const statusBg =
                statusLower === "in progress"
                  ? "rgba(34,197,94,0.08)"
                  : statusLower === "ready"
                  ? "rgba(245,158,11,0.08)"
                  : "rgba(107,100,98,0.08)";
              const statusBorder =
                statusLower === "in progress"
                  ? "rgba(34,197,94,0.15)"
                  : statusLower === "ready"
                  ? "rgba(245,158,11,0.15)"
                  : "rgba(107,100,98,0.15)";

              return (
                <a
                  key={task.id}
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid var(--glass-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(179,170,163,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                    e.currentTarget.style.borderColor = "rgba(179,170,163,0.08)";
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: statusColor }}
                    />
                    <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                      {task.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span
                      className="px-2 py-1 rounded-md"
                      style={{
                        color: statusColor,
                        background: statusBg,
                        border: `1px solid ${statusBorder}`,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {task.status}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <PendingState label="No active tasks" />
        )}
      </section>

      {/* PG Slack Feed */}
      <section className="mb-10">
        <h2 className="section-heading mb-5">PG Slack</h2>
        <PendingState
          label="PG Slack feed pending token"
          connectLabel="Extract PG bot token from MCP config"
        />
      </section>
    </div>
  );
}
