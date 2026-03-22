"use client";

import React, { useState, useEffect } from "react";

export interface ActionItem {
  id: string;
  type: "REQ" | "F/U" | "TASK";
  description: string;
  timeAgo?: string;
  dueDate?: string | null;
  source: string;
  sourceType: "clickup" | "notion" | "static";
  sourceId?: string;
  sourceUrl?: string;
  priority?: number;
}

interface ActionListProps {
  items: ActionItem[];
  onComplete?: (item: ActionItem) => void;
}

const typeBadgeColors: Record<string, { bg: string; color: string }> = {
  REQ: { bg: "rgba(239,68,68,0.15)", color: "var(--neon-red)" },
  "F/U": { bg: "rgba(245,158,11,0.15)", color: "var(--neon-amber)" },
  TASK: { bg: "rgba(59,130,246,0.15)", color: "var(--neon-blue)" },
};

export default function ActionList({ items, onComplete }: ActionListProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [priorities, setPriorities] = useState<Record<string, number>>({});
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState("");

  // Load dismissed/priorities from localStorage
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("ob-dismissed");
      if (dismissed) setDismissedIds(new Set(JSON.parse(dismissed)));
      const prios = localStorage.getItem("ob-priorities");
      if (prios) setPriorities(JSON.parse(prios));
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const handleDone = async (item: ActionItem) => {
    if (item.sourceType !== "clickup" || !item.sourceId) return;
    setCompletingIds((prev) => new Set(prev).add(item.id));
    try {
      const res = await fetch("/api/clickup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: item.sourceId }),
      });
      if (res.ok) {
        onComplete?.(item);
        showToast("Task completed");
      }
    } catch {
      showToast("Failed to complete");
    } finally {
      setCompletingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleAct = (item: ActionItem) => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, "_blank");
    }
  };

  const handleNudge = () => {
    showToast("Nudge sent");
  };

  const handlePriority = (item: ActionItem, level: number) => {
    const newPriorities = { ...priorities, [item.id]: level };
    setPriorities(newPriorities);
    localStorage.setItem("ob-priorities", JSON.stringify(newPriorities));
    showToast(`Priority set to +${level}`);
  };

  const handleNotYet = (item: ActionItem) => {
    showToast("Deferred");
    // Future: update due date in ClickUp
    handleDismiss(item);
  };

  const handleDismiss = (item: ActionItem) => {
    const newDismissed = new Set(dismissedIds).add(item.id);
    setDismissedIds(newDismissed);
    localStorage.setItem("ob-dismissed", JSON.stringify([...newDismissed]));
  };

  const visibleItems = items.filter((item) => !dismissedIds.has(item.id));

  // Sort by priority (higher first), then by original order
  const sortedItems = [...visibleItems].sort((a, b) => {
    const pa = priorities[a.id] || 0;
    const pb = priorities[b.id] || 0;
    return pb - pa;
  });

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No action items
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-3">
        {sortedItems.map((item) => {
          const badge = typeBadgeColors[item.type] || typeBadgeColors.TASK;
          const isCompleting = completingIds.has(item.id);
          const itemPriority = priorities[item.id];

          return (
            <div
              key={item.id}
              className="rounded-xl transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(23, 21, 21, 0.9) 0%, rgba(31, 28, 28, 0.7) 100%)",
                border: itemPriority
                  ? `1px solid rgba(0,255,200,${0.1 + itemPriority * 0.05})`
                  : "1px solid var(--border)",
              }}
            >
              <div className="p-4 flex items-start gap-3">
                {/* Type badge */}
                <span
                  className="shrink-0 px-2 py-1 rounded text-xs font-bold uppercase mt-0.5"
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.type}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {item.timeAgo && (
                      <span
                        className="text-xs metric-value"
                        style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                      >
                        {item.timeAgo}
                      </span>
                    )}
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                    >
                      {item.source}
                    </span>
                    {itemPriority && (
                      <span
                        className="text-xs font-bold metric-value"
                        style={{ color: "var(--accent)", fontSize: "0.6rem" }}
                      >
                        +{itemPriority}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="px-4 pb-3 flex items-center gap-1.5 flex-wrap"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="pt-2.5 flex items-center gap-1.5 flex-wrap">
                  {/* DONE */}
                  {item.sourceType === "clickup" && item.sourceId && (
                    <button
                      onClick={() => handleDone(item)}
                      disabled={isCompleting}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        color: "var(--neon-green)",
                        border: "1px solid rgba(34,197,94,0.2)",
                        fontSize: "0.6rem",
                        opacity: isCompleting ? 0.5 : 1,
                      }}
                    >
                      {isCompleting ? "..." : "DONE"}
                    </button>
                  )}

                  {/* ACT */}
                  {item.sourceUrl && (
                    <button
                      onClick={() => handleAct(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        color: "var(--neon-blue)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        fontSize: "0.6rem",
                      }}
                    >
                      ACT
                    </button>
                  )}

                  {/* NUDGE */}
                  <button
                    onClick={handleNudge}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      color: "var(--neon-amber)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      fontSize: "0.6rem",
                    }}
                  >
                    NUDGE
                  </button>

                  {/* Priority: +1 +2 +3 */}
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => handlePriority(item, level)}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                      style={{
                        background: itemPriority === level ? "rgba(0,255,200,0.15)" : "rgba(255,255,255,0.04)",
                        color: itemPriority === level ? "var(--accent)" : "var(--text-muted)",
                        border: itemPriority === level ? "1px solid rgba(0,255,200,0.25)" : "1px solid var(--border)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                      }}
                    >
                      +{level}
                    </button>
                  ))}

                  {/* NOT YET */}
                  <button
                    onClick={() => handleNotYet(item)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border)",
                      fontSize: "0.6rem",
                    }}
                  >
                    NOT YET
                  </button>

                  {/* X */}
                  <button
                    onClick={() => handleDismiss(item)}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border)",
                      fontSize: "0.6rem",
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm toast-enter z-50"
          style={{
            background: "rgba(19,17,17,0.95)",
            border: "1px solid rgba(0,255,200,0.2)",
            color: "var(--accent)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
