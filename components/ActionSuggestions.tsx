"use client";

import React, { useState } from "react";

export interface Suggestion {
  directive: string;
  estimatedTime: string;
  reason: string;
}

interface ActionSuggestionsProps {
  suggestions: Suggestion[];
}

export default function ActionSuggestions({ suggestions }: ActionSuggestionsProps) {
  const [expandedReason, setExpandedReason] = useState<number | null>(null);

  if (suggestions.length === 0) return null;

  return (
    <div>
      <h3 className="section-heading mb-5">
        What I Can Do Right Now
      </h3>
      <div className="space-y-4">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(0,255,200,0.02)",
              border: "1px solid rgba(0,255,200,0.08)",
              padding: "20px 24px",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {suggestion.directive}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span
                    className="metric-value"
                    style={{ color: "var(--accent)", fontSize: "0.7rem" }}
                  >
                    ~{suggestion.estimatedTime}
                  </span>
                  <button
                    className="text-xs underline decoration-dotted underline-offset-2"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.65rem",
                    }}
                    onClick={() => setExpandedReason(expandedReason === idx ? null : idx)}
                  >
                    {expandedReason === idx ? "hide" : "why?"}
                  </button>
                </div>
                {expandedReason === idx && (
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{
                      color: "var(--text-muted)",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "12px",
                    }}
                  >
                    {suggestion.reason}
                  </p>
                )}
              </div>
              <button
                className="action-btn shrink-0"
                style={{
                  background: "rgba(0,255,200,0.1)",
                  color: "var(--accent)",
                  borderColor: "rgba(0,255,200,0.2)",
                  padding: "8px 16px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
                onClick={() => {
                  // Future: triggers Claude Code execution
                }}
              >
                DO IT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
