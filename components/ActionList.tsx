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
  REQ: { bg: "rgba(239,68,68,0.12)", color: "var(--neon-red)" },
  "F/U": { bg: "rgba(245,158,11,0.12)", color: "var(--neon-amber)" },
  TASK: { bg: "rgba(59,130,246,0.12)", color: "var(--neon-blue)" },
};

export default function ActionList({ items, onComplete }: ActionListProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [priorities, setPriorities] = useState<Record<string, number>>({});
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState("");

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
    if (item.sourceUrl) window.open(item.sourceUrl, "_blank");
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
    showToast("Deferred to tomorrow");
    handleDismiss(item);
  };

  const handleDismiss = (item: ActionItem) => {
    const newDismissed = new Set(dismissedIds).add(item.id);
    setDismissedIds(newDismissed);
    localStorage.setItem("ob-dismissed", JSON.stringify([...newDismissed]));
  };

  const visibleItems = items.filter((item) => !dismissedIds.has(item.id));

  const sortedItems = [...visibleItems].sort((a, b) => {
    const pa = priorities[a.id] || 0;
    const pb = priorities[b.id] || 0;
    return pb - pa;
  });

  if (sortedItems.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-2xl"
        style={{
          border: "1px dashed rgba(179,170,163,0.12)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No action items -- all clear
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-4">
        {sortedItems.map((item) => {
          const badge = typeBadgeColors[item.type] || typeBadgeColors.TASK;
          const isCompleting = completingIds.has(item.id);
          const itemPriority = priorities[item.id];

          return (
            <div
              key={item.id}
              className="rounded-2xl transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(23, 21, 21, 0.9) 0%, rgba(31, 28, 28, 0.7) 100%)",
                border: itemPriority
                  ? `1px solid rgba(0,255,200,${0.08 + itemPriority * 0.04})`
                  : "1px solid var(--glass-border)",
              }}
            >
              {/* Content */}
              <div className="p-5 flex items-start gap-4">
                {/* Type badge */}
                <span
                  className="shrink-0 px-2.5 py-1 rounded-md mt-0.5"
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.type}
                </span>

                {/* Description + meta */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {item.timeAgo && (
                      <span
                        className="metric-value"
                        style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
                      >
                        {item.timeAgo}
                      </span>
                    )}
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
                    >
                      {item.source}
                    </span>
                    {itemPriority && (
                      <span
                        className="metric-value font-bold"
                        style={{ color: "var(--accent)", fontSize: "0.65rem" }}
                      >
                        +{itemPriority}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="px-5 pb-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="pt-3 flex items-center gap-2 flex-wrap">
                  {/* DONE */}
                  {item.sourceType === "clickup" && item.sourceId && (
                    <button
                      onClick={() => handleDone(item)}
                      disabled={isCompleting}
                      className="action-btn"
                      style={{
                        background: "rgba(34,197,94,0.08)",
                        color: "var(--neon-green)",
                        borderColor: "rgba(34,197,94,0.18)",
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
                      className="action-btn"
                      style={{
                        background: "rgba(59,130,246,0.08)",
                        color: "var(--neon-blue)",
                        borderColor: "rgba(59,130,246,0.18)",
                      }}
                    >
                      ACT
                    </button>
                  )}

                  {/* NUDGE */}
                  <button
                    onClick={handleNudge}
                    className="action-btn"
                    style={{
                      background: "rgba(245,158,11,0.08)",
                      color: "var(--neon-amber)",
                      borderColor: "rgba(245,158,11,0.18)",
                    }}
                  >
                    NUDGE
                  </button>

                  {/* Separator */}
                  <span
                    className="w-px h-4 mx-1"
                    style={{ background: "var(--border)" }}
                  />

                  {/* Priority: +1 +2 +3 */}
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => handlePriority(item, level)}
                      className="action-btn"
                      style={{
                        background: itemPriority === level ? "rgba(0,255,200,0.12)" : "rgba(255,255,255,0.03)",
                        color: itemPriority === level ? "var(--accent)" : "var(--text-muted)",
                        borderColor: itemPriority === level ? "rgba(0,255,200,0.2)" : "var(--border)",
                      }}
                    >
                      +{level}
                    </button>
                  ))}

                  {/* Separator */}
                  <span
                    className="w-px h-4 mx-1"
                    style={{ background: "var(--border)" }}
                  />

                  {/* NOT YET */}
                  <button
                    onClick={() => handleNotYet(item)}
                    className="action-btn"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      color: "var(--text-muted)",
                      borderColor: "var(--border)",
                    }}
                  >
                    NOT YET
                  </button>

                  {/* X */}
                  <button
                    onClick={() => handleDismiss(item)}
                    className="action-btn"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      color: "var(--text-muted)",
                      borderColor: "var(--border)",
                      padding: "6px 10px",
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
          className="fixed bottom-24 md:bottom-8 left-1/2 px-5 py-3 rounded-xl text-sm toast-enter z-50"
          style={{
            background: "rgba(17,16,16,0.96)",
            border: "1px solid rgba(0,255,200,0.15)",
            color: "var(--accent)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            transform: "translateX(-50%)",
            fontSize: "0.8rem",
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
