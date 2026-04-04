"use client";

import { useState } from "react";
import { logAction } from "@/lib/logAction";

interface Suggestion {
  directive: string;
  time_estimate: string;
  reason: string;
  priority: string;
  source: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (!suggestions || suggestions.length === 0) return null;

  const priorityColor: Record<string, string> = {
    high: "var(--red)",
    medium: "var(--amber)",
    low: "var(--text-dim)",
  };

  const priorityBg: Record<string, string> = {
    high: "rgba(240,68,56,0.1)",
    medium: "rgba(247,144,9,0.1)",
    low: "rgba(255,255,255,0.04)",
  };

  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div className="label" style={{ marginBottom: "16px", color: "var(--accent)" }}>
        What I Can Do Right Now
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {suggestions.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-raised)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: priorityBg[s.priority] || priorityBg.low,
                      color: priorityColor[s.priority] || priorityColor.low,
                    }}
                  >
                    {s.priority}
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: "11px", color: "var(--text-dim)" }}
                  >
                    {s.time_estimate}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-bright)",
                    lineHeight: 1.4,
                  }}
                >
                  {s.directive}
                </div>

                {/* Expandable WHY */}
                {expandedIdx === i && s.reason && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-dim)",
                      marginTop: "8px",
                      lineHeight: 1.5,
                      paddingLeft: "8px",
                      borderLeft: "2px solid var(--border-strong)",
                    }}
                  >
                    {s.reason}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "var(--bg-hover)",
                    color: "var(--text-dim)",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  {expandedIdx === i ? "Hide" : "Why"}
                </button>
                <button
                  onClick={() => {
                    logAction("do_it", "suggestions", `suggestion-${i}`, {
                      directive: s.directive,
                      source: s.source,
                    });
                  }}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    cursor: "pointer",
                  }}
                >
                  Do It
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
