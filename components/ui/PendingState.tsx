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
      className="p-8 rounded-xl text-center"
      style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px dashed rgba(179, 170, 163, 0.12)",
      }}
    >
      {icon && (
        <div className="flex justify-center mb-4" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
          {icon}
        </div>
      )}
      <p className="text-sm italic mb-2" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      {connectLabel && (
        <p
          className="flex items-center justify-center gap-2 mt-3"
          style={{
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            opacity: 0.7,
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
