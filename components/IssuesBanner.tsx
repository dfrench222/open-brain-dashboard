"use client";

import React, { useState } from "react";

interface IssuesBannerProps {
  issues: string[];
  warnings: string[];
}

export default function IssuesBanner({ issues, warnings }: IssuesBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const total = issues.length + warnings.length;

  if (total === 0) return null;

  const isError = issues.length > 0;
  const accentColor = isError ? "var(--neon-red)" : "var(--neon-amber)";
  const bgColor = isError ? "rgba(239,68,68,0.05)" : "rgba(245,158,11,0.05)";
  const borderColor = isError ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";

  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={accentColor}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {total} {total === 1 ? "issue" : "issues"} detected
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: "transform 0.2s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {issues.map((issue, idx) => (
            <div
              key={`i-${idx}`}
              className="flex items-start gap-3 px-5 py-3 rounded-lg"
              style={{ background: "rgba(239,68,68,0.03)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-red)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{issue}</span>
            </div>
          ))}
          {warnings.map((warning, idx) => (
            <div
              key={`w-${idx}`}
              className="flex items-start gap-3 px-5 py-3 rounded-lg"
              style={{ background: "rgba(245,158,11,0.03)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-amber)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
