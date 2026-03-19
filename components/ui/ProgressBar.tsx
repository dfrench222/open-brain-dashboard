"use client";

import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  height?: number;
}

export default function ProgressBar({
  value,
  max,
  color = "var(--neon-cyan)",
  label,
  showValue = true,
  height = 8,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              {label}
            </span>
          )}
          {showValue && (
            <span
              className="text-xs font-mono font-medium"
              style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: `${height}px`,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="neon-progress h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 10px ${color}60, 0 0 20px ${color}30`,
          }}
        />
      </div>
    </div>
  );
}
