"use client";

import React, { useEffect, useState } from "react";
import CommandBar from "@/components/CommandBar";
import PendingState from "@/components/ui/PendingState";

interface SlackMessage {
  id: string;
  channel: string;
  channel_id: string;
  sender: string;
  preview: string;
  full_text: string;
  timestamp: string;
  message_ts: string;
  workspace: string;
  tier: number;
}

const tierColors: Record<number, string> = {
  1: "var(--neon-red)",
  2: "var(--neon-amber)",
  3: "var(--text-muted)",
};

const tierLabels: Record<number, string> = {
  1: "Urgent",
  2: "Important",
  3: "FYI",
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getSlackLink(msg: SlackMessage): string | null {
  const domains: Record<string, string> = {
    "jumm-life": "jummlife",
    "performance-golf": "performancegolf",
  };
  const domain = domains[msg.workspace];
  if (!domain || !msg.channel_id || !msg.message_ts) return null;
  const tsFormatted = msg.message_ts.replace(".", "");
  return `https://${domain}.slack.com/archives/${msg.channel_id}/p${tsFormatted}`;
}

export default function CommunicationsPage() {
  const [jlMessages, setJlMessages] = useState<SlackMessage[]>([]);
  const [jlLoading, setJlLoading] = useState(true);
  const [jlError, setJlError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/slack-jl")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setJlMessages(data);
        } else if (data.error) {
          setJlError(data.error);
        }
      })
      .catch(() => setJlError("Failed to connect"))
      .finally(() => setJlLoading(false));
  }, []);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div>
      <CommandBar />

      <h1
        className="text-lg font-semibold mb-8"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Communications
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jumm Life Slack */}
        <section>
          <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid rgba(0,255,200,0.08)" }}>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }}
            />
            <span
              className="uppercase tracking-wider font-semibold"
              style={{ color: "var(--accent)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
            >
              Jumm Life Slack
            </span>
            {jlMessages.length > 0 && (
              <span
                className="ml-auto px-2 py-0.5 rounded-full metric-value"
                style={{
                  color: "var(--accent)",
                  background: "rgba(0,255,200,0.06)",
                  fontSize: "0.6rem",
                }}
              >
                {jlMessages.length}
              </span>
            )}
          </div>

          {jlLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 animate-fade-in-up"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid var(--glass-border)",
                    animationDelay: `${i * 100}ms`,
                    opacity: 0,
                  }}
                >
                  <div className="h-4 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              ))}
            </div>
          ) : jlError ? (
            <PendingState label={jlError} connectLabel="Check SLACK_JL_BOT_TOKEN" />
          ) : jlMessages.length === 0 ? (
            <PendingState label="No messages" />
          ) : (
            <div className="space-y-3">
              {jlMessages.map((msg) => {
                const isExpanded = expandedId === msg.id;
                const link = getSlackLink(msg);
                const tierColor = tierColors[msg.tier] || "var(--border)";
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: isExpanded ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                      borderLeft: `3px solid ${tierColor}`,
                      borderTop: "1px solid var(--glass-border)",
                      borderRight: "1px solid var(--glass-border)",
                      borderBottom: "1px solid var(--glass-border)",
                    }}
                    onClick={() => toggle(msg.id)}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <span
                        className="text-sm font-medium shrink-0"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {msg.sender}
                      </span>
                      <span
                        className="text-sm flex-1 min-w-0 truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {msg.preview}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {msg.tier <= 2 && (
                          <span
                            className="px-1.5 py-0.5 rounded"
                            style={{
                              background: msg.tier === 1 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                              color: tierColor,
                              fontSize: "0.55rem",
                              fontFamily: "'JetBrains Mono', monospace",
                              fontWeight: 600,
                            }}
                          >
                            {tierLabels[msg.tier]}
                          </span>
                        )}
                        <span
                          className="metric-value"
                          style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                        >
                          {timeAgo(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div
                        className="px-4 pb-4"
                        style={{ borderTop: "1px solid var(--border)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="pt-3">
                          <span
                            className="metric-value block mb-2"
                            style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                          >
                            #{msg.channel}
                          </span>
                          <p
                            className="text-sm leading-relaxed mb-4"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {msg.full_text}
                          </p>
                          {link && (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-btn"
                              style={{
                                color: "var(--neon-blue)",
                                background: "rgba(59,130,246,0.06)",
                                borderColor: "rgba(59,130,246,0.15)",
                              }}
                            >
                              Open in Slack
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Performance Golf Slack */}
        <section>
          <div className="flex items-center gap-2.5 mb-5 pb-3" style={{ borderBottom: "1px solid rgba(245,158,11,0.08)" }}>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "var(--neon-amber)", boxShadow: "0 0 6px var(--neon-amber)" }}
            />
            <span
              className="uppercase tracking-wider font-semibold"
              style={{ color: "var(--neon-amber)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
            >
              Performance Golf Slack
            </span>
          </div>
          <PendingState
            label="PG Slack feed pending token"
            connectLabel="Extract PG bot token from MCP config"
          />
        </section>
      </div>
    </div>
  );
}
