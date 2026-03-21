"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  list: string;
}

export default function PGCommandCenter() {
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    fetch("/api/clickup")
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
          setTasks(data.tasks.slice(0, 5));
          setHasRealData(true);
        }
      })
      .catch(() => {});
  }, []);

  const activeTasks = tasks.filter(
    (t) => t.status !== "Closed" && t.status !== "hold for launch"
  );

  return (
    <GlassCard delay={300}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-blue)">
          PG Command Center
        </NeonText>
      </div>

      {/* Revenue target — PENDING: no DOMO or PG financials connected */}
      <div
        className="mb-6 p-5 rounded-xl"
        style={{
          border: "1px dashed rgba(179, 170, 163, 0.15)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex items-baseline justify-between mb-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em" }}
          >
            2026 Revenue Target
          </span>
        </div>
        <span className="text-sm block italic" style={{ color: "var(--text-muted)" }}>
          Pending connection
        </span>
        <span
          className="text-xs mt-2 flex items-center gap-1.5"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Connect PG metrics (DOMO)
        </span>
      </div>

      {/* Active tasks from ClickUp (or pending) */}
      <div
        className="p-5 rounded-xl mb-6"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: hasRealData
            ? "1px solid var(--glass-border)"
            : "1px dashed rgba(179, 170, 163, 0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em" }}
          >
            Active Tasks
          </span>
          {hasRealData ? (
            <span
              className="text-xl font-bold metric-value"
              style={{ color: "var(--neon-blue)", textShadow: "0 0 10px rgba(59,130,246,0.3)" }}
            >
              {activeTasks.length}
            </span>
          ) : (
            <span className="text-sm italic" style={{ color: "var(--text-muted)" }}>
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Task list (real ClickUp data or pending) */}
      <div>
        <span
          className="text-xs uppercase tracking-wider block mb-3"
          style={{ color: "var(--text-muted)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em" }}
        >
          {hasRealData ? "ClickUp Tasks" : "Launch Calendar"}
        </span>

        {hasRealData ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeTasks.slice(0, 5).map((task) => {
              const statusColor =
                task.status === "in progress"
                  ? "var(--neon-green)"
                  : task.status === "ready"
                  ? "var(--neon-amber)"
                  : "var(--text-muted)";

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--glass-border)",
                    gap: "12px",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
                    />
                    <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                      {task.name}
                    </span>
                  </div>
                  <span
                    className="text-xs uppercase px-2.5 py-1 rounded shrink-0 whitespace-nowrap"
                    style={{
                      color: statusColor,
                      background: `${statusColor}10`,
                      border: `1px solid ${statusColor}20`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="p-5 rounded-xl"
            style={{
              border: "1px dashed rgba(179, 170, 163, 0.15)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span className="text-sm block italic" style={{ color: "var(--text-muted)" }}>
              Pending connection
            </span>
            <span
              className="text-xs mt-2 flex items-center gap-1.5"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Connect ClickUp
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
