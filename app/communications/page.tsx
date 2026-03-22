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
    // Fetch JL messages from real API
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
        className="text-lg font-semibold mb-6"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Communications
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jumm Life Slack */}
        <section>
          <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(0,255,200,0.1)" }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--accent)", fontSize: "0.7rem" }}>
              Jumm Life Slack
            </span>
            {jlMessages.length > 0 && (
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{ color: "var(--accent)", background: "rgba(0,255,200,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                {jlMessages.length}
              </span>
            )}
          </div>

          {jlLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                  <div className="h-4 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              ))}
            </div>
          ) : jlError ? (
            <PendingState label={jlError} connectLabel="Check SLACK_JL_BOT_TOKEN" />
          ) : jlMessages.length === 0 ? (
            <p className="text-sm italic py-4" style={{ color: "var(--text-muted)" }}>No messages</p>
          ) : (
            <div className="space-y-2">
              {jlMessages.map((msg) => {
                const isExpanded = expandedId === msg.id;
                const link = getSlackLink(msg);
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: isExpanded ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                      borderLeft: `2px solid ${tierColors[msg.tier] || "var(--border)"}`,
                      borderTop: "1px solid var(--border)",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onClick={() => toggle(msg.id)}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <span className="text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>{msg.sender}</span>
                      <span className="text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text-muted)" }}>{msg.preview}</span>
                      <span className="text-xs shrink-0 metric-value" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>{timeAgo(msg.timestamp)}</span>
                    </div>
                    {isExpanded && (
                      <div className="px-3 pb-3" style={{ borderTop: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
                        <div className="pt-2">
                          <span className="text-xs metric-value block mb-2" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>{msg.channel}</span>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{msg.full_text}</p>
                          {link && (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                              style={{ color: "var(--neon-blue)", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
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
          <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(245,158,11,0.1)" }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--neon-amber)", boxShadow: "0 0 6px var(--neon-amber)" }} />
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--neon-amber)", fontSize: "0.7rem" }}>
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
