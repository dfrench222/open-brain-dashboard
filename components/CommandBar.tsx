"use client";

import React, { useState } from "react";

export default function CommandBar() {
  const [input, setInput] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleGo = () => {
    if (!input.trim()) return;
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setInput("");
  };

  return (
    <div className="relative mb-8">
      <div
        className="flex items-center gap-3 p-3 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(23, 21, 21, 0.9) 0%, rgba(31, 28, 28, 0.7) 100%)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,255,200,0.08)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGo()}
          placeholder="What do you want done?"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{
            color: "var(--text-primary)",
            caretColor: "var(--accent)",
          }}
        />
        <button
          onClick={handleGo}
          className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0"
          style={{
            background: input.trim() ? "rgba(0,255,200,0.15)" : "rgba(255,255,255,0.05)",
            color: input.trim() ? "var(--accent)" : "var(--text-muted)",
            border: input.trim() ? "1px solid rgba(0,255,200,0.25)" : "1px solid var(--border)",
            cursor: input.trim() ? "pointer" : "default",
          }}
        >
          Go
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-5 py-3 rounded-xl text-sm toast-enter z-50"
          style={{
            background: "rgba(19,17,17,0.95)",
            border: "1px solid rgba(0,255,200,0.2)",
            color: "var(--accent)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          Coming soon -- Claude Code integration
        </div>
      )}
    </div>
  );
}
