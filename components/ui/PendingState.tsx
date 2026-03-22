"use client";

import React from "react";

interface PendingStateProps {
  label: string;
  connectLabel?: string;
  icon?: React.ReactNode;
}

export default function PendingState({ label, connectLabel, icon }: PendingStateProps) {
  return (
    <div
      className="p-6 rounded-xl text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(179, 170, 163, 0.15)",
      }}
    >
      {icon && (
        <div className="flex justify-center mb-3" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
          {icon}
        </div>
      )}
      <p className="text-sm italic mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      {connectLabel && (
        <p
          className="text-xs flex items-center justify-center gap-1.5 mt-2"
          style={{
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          {connectLabel}
        </p>
      )}
    </div>
  );
}
