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
      <div className="animate-fade-in-up delay-200 mb-10" style={{ opacity: 0 }}>
        <h2 className="section-heading mb-5">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard
            label="Active Tasks"
            value={taskCount !== null ? String(taskCount) : null}
            color="var(--neon-blue)"
            delay={0}
          />
          <StatCard
            label="People Indexed"
            value={stats?.people !== null && stats?.people !== undefined ? String(stats.people) : null}
            color="var(--neon-green)"
            delay={1}
          />
          <StatCard
            label="Projects"
            value={stats?.projects !== null && stats?.projects !== undefined ? String(stats.projects) : null}
            color="var(--neon-amber)"
            delay={2}
          />
          <StatCard
            label="Daily Quotes"
            value={stats?.quotes !== null && stats?.quotes !== undefined ? String(stats.quotes) : null}
            color="var(--neon-purple)"
            delay={3}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string | null;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: "24px",
        animationDelay: `${300 + delay * 100}ms`,
        opacity: 0,
      }}
    >
      <span className="kpi-label block mb-3">{label}</span>
      {value !== null ? (
        <span
          className="text-2xl font-bold block metric-value"
          style={{ color, textShadow: `0 0 12px ${color}25` }}
        >
          {value}
        </span>
      ) : (
        <span
          className="text-lg block italic"
          style={{ color: "var(--text-muted)", opacity: 0.5 }}
        >
          --
        </span>
      )}
    </div>
  );
}
