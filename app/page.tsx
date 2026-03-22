"use client";

import React, { useEffect, useState } from "react";
import CommandBar from "@/components/CommandBar";
import MorningAnchor from "@/components/MorningAnchor";
import DailyBriefing from "@/components/DailyBriefing";

interface BrainStats {
  thoughts: number | null;
  people: number | null;
  projects: number | null;
  quotes: number | null;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<BrainStats | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/brain-stats")
      .then((res) => res.json())
      .then((data) => { if (!data.error) setStats(data); })
      .catch(() => {});

    fetch("/api/clickup")
      .then((res) => res.json())
      .then((data) => { if (data.total !== undefined) setTaskCount(data.total); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <CommandBar />

      {/* Morning Anchor */}
      <div className="mb-10">
        <MorningAnchor />
      </div>

      {/* Daily Briefing */}
      <div className="mb-10">
        <DailyBriefing />
      </div>

      {/* Quick Stats */}
      <div className="mb-10">
        <h2
          className="text-xs uppercase tracking-widest font-semibold mb-5"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}
        >
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Active Tasks"
            value={taskCount !== null ? String(taskCount) : null}
            color="var(--neon-blue)"
          />
          <StatCard
            label="People Indexed"
            value={stats?.people !== null && stats?.people !== undefined ? String(stats.people) : null}
            color="var(--neon-green)"
          />
          <StatCard
            label="Projects"
            value={stats?.projects !== null && stats?.projects !== undefined ? String(stats.projects) : null}
            color="var(--neon-amber)"
          />
          <StatCard
            label="Daily Quotes"
            value={stats?.quotes !== null && stats?.quotes !== undefined ? String(stats.quotes) : null}
            color="var(--neon-purple)"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | null; color: string }) {
  return (
    <div
      className="glass-card p-5 text-center"
    >
      {value !== null ? (
        <span
          className="text-2xl font-bold block mb-1 metric-value"
          style={{ color, textShadow: `0 0 10px ${color}30` }}
        >
          {value}
        </span>
      ) : (
        <span className="text-sm block mb-1 italic" style={{ color: "var(--text-muted)" }}>
          --
        </span>
      )}
      <span
        className="text-xs block kpi-label"
      >
        {label}
      </span>
    </div>
  );
}
