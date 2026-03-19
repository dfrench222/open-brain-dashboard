"use client";

import React from "react";

interface StatusBadgeProps {
  status: "active" | "planning" | "building" | "paused" | "completed";
  label?: string;
}

const statusConfig = {
  active: { color: "var(--neon-green)", bg: "rgba(34, 197, 94, 0.1)", label: "Active" },
  planning: { color: "var(--neon-amber)", bg: "rgba(245, 158, 11, 0.1)", label: "Planning" },
  building: { color: "var(--neon-cyan)", bg: "rgba(0, 255, 200, 0.1)", label: "Building" },
  paused: { color: "var(--text-muted)", bg: "rgba(71, 85, 105, 0.1)", label: "Paused" },
  completed: { color: "var(--neon-purple)", bg: "rgba(168, 85, 247, 0.1)", label: "Completed" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}30`,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 6px ${config.color}`,
        }}
      />
      {label || config.label}
    </span>
  );
}
