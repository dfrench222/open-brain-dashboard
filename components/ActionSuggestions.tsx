"use client";

import React from "react";

export interface Suggestion {
  directive: string;
  estimatedTime: string;
  reason: string;
}

interface ActionSuggestionsProps {
  suggestions: Suggestion[];
}

export default function ActionSuggestions({ suggestions }: ActionSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div>
      <h3
        className="text-xs uppercase tracking-widest font-semibold mb-4"
        style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}
      >
        What I Can Do Right Now
      </h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(0,255,200,0.03)",
              border: "1px solid rgba(0,255,200,0.08)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  {suggestion.directive}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="text-xs metric-value"
                    style={{ color: "var(--accent)", fontSize: "0.65rem" }}
                  >
                    ~{suggestion.estimatedTime}
                  </span>
                  <button
                    className="text-xs underline"
                    style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                    onClick={() => alert(suggestion.reason)}
                  >
                    why?
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
