"use client";

import React, { useState } from "react";

interface Notification {
  id: string;
  tier: 1 | 2 | 3;
  message: string;
  source: string;
}

const notifications: Notification[] = [
  { id: "1", tier: 1, message: "Restitution payment due March 25", source: "Finance" },
  { id: "2", tier: 1, message: "PG Q1 revenue review — schedule with Brixton", source: "Performance Golf" },
  { id: "3", tier: 2, message: "Penny's spring break schedule — confirm dates with Araba", source: "Family" },
  { id: "4", tier: 2, message: "De French 2.0 content calendar review", source: "Projects" },
  { id: "5", tier: 3, message: "Update knowledge base distillation pipeline", source: "Second Brain" },
  { id: "6", tier: 3, message: "Freedom Factor project kickoff planning", source: "Projects" },
];

const tierConfig = {
  1: { color: "var(--neon-red)", bg: "rgba(239,68,68,0.08)", label: "NEEDS ATTENTION", icon: "!!" },
  2: { color: "var(--neon-amber)", bg: "rgba(245,158,11,0.08)", label: "CHECK LATER", icon: "!" },
  3: { color: "var(--text-muted)", bg: "rgba(71,85,105,0.06)", label: "WHEN FREE", icon: "~" },
};

export default function NotificationBar() {
  const [expanded, setExpanded] = useState(false);
  const tier1Count = notifications.filter((n) => n.tier === 1).length;
  const tier2Count = notifications.filter((n) => n.tier === 2).length;

  const visibleNotifications = expanded ? notifications : notifications.filter((n) => n.tier === 1);

  return (
    <div className="px-6 animate-fade-in-up" style={{ animationDelay: "150ms", opacity: 0 }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Summary bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(17,17,24,0.6)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="text-xs uppercase tracking-[0.2em] font-medium"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--text-muted)", fontSize: "0.6rem" }}
            >
              Ivy Lee Queue
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--neon-red)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--neon-red)", boxShadow: "0 0 8px var(--neon-red)" }} />
                {tier1Count}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--neon-amber)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--neon-amber)", boxShadow: "0 0 8px var(--neon-amber)" }} />
                {tier2Count}
              </span>
            </div>
          </div>
          <span
            className="text-xs transition-transform duration-200"
            style={{
              color: "var(--text-muted)",
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            &#x25BC;
          </span>
        </button>

        {/* Notification items */}
        {visibleNotifications.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {visibleNotifications.map((notification, i) => {
              const config = tierConfig[notification.tier];
              return (
                <div
                  key={notification.id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 animate-slide-in-left"
                  style={{
                    background: config.bg,
                    border: `1px solid ${config.color}15`,
                    animationDelay: `${i * 50}ms`,
                    opacity: 0,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      color: config.color,
                      background: `${config.color}15`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {config.icon}
                  </span>
                  <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>
                    {notification.message}
                  </span>
                  <span
                    className="text-xs shrink-0"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {notification.source}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
