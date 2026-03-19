"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface SlackMessage {
  id: string;
  channel: string;
  channel_id?: string;
  sender: string;
  preview: string;
  full_text?: string;
  timestamp: string;
  message_ts?: string;
  workspace: string;
  tier: number;
}

const tierColors: Record<number, string> = {
  1: "#ef4444",
  2: "#eab308",
  3: "var(--text-muted)",
};

const workspaceSlackDomains: Record<string, string> = {
  "jumm-life": "jummlife",
  "performance-golf": "performancegolf",
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
  const domain = workspaceSlackDomains[msg.workspace];
  if (!domain) return null;
  if (msg.channel_id && msg.message_ts) {
    const tsFormatted = msg.message_ts.replace(".", "");
    return `https://${domain}.slack.com/archives/${msg.channel_id}/p${tsFormatted}`;
  }
  if (msg.channel_id) {
    return `https://app.slack.com/client/T092T5NH2EP/${msg.channel_id}`;
  }
  return null;
}

function getChannelIcon(channel: string): React.ReactNode {
  if (channel === "DM") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3L8 21" />
      <path d="M16 3l-2 18" />
    </svg>
  );
}

export default function Communications() {
  const [jlMessages, setJlMessages] = useState<SlackMessage[]>([]);
  const [pgMessages, setPgMessages] = useState<SlackMessage[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  useEffect(() => {
    fetch("/api/slack")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJlMessages(data);
      })
      .catch(() => {});

    fetch("/api/slack-pg")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPgMessages(data);
      })
      .catch(() => {});
  }, []);

  return (
    <GlassCard delay={350}>
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <NeonText size="md" color="var(--neon-blue)">
          Communications
        </NeonText>
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{
            color: "var(--neon-blue)",
            background: "rgba(59,130,246,0.08)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
          }}
        >
          {jlMessages.length + pgMessages.length} messages
        </span>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* JUMM LIFE Column */}
        <div className="p-1">
          <div className="flex items-center gap-2.5 mb-6 pb-3" style={{ borderBottom: "1px solid rgba(0,255,200,0.1)" }}>
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--neon-cyan)", boxShadow: "0 0 6px var(--neon-cyan)" }}
            />
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--neon-cyan)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem" }}
            >
              Jumm Life
            </span>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full"
              style={{ color: "var(--neon-cyan)", background: "rgba(0,255,200,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {jlMessages.length}
            </span>
          </div>
          <div className="space-y-3">
            {jlMessages.map((msg) => (
              <MessageRow key={msg.id} msg={msg} isExpanded={expandedId === msg.id} onToggle={() => toggle(msg.id)} />
            ))}
            {jlMessages.length === 0 && (
              <p className="text-xs py-4" style={{ color: "var(--text-muted)" }}>Loading...</p>
            )}
          </div>
        </div>

        {/* Column Divider */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "var(--glass-border)" }} />

        {/* PERFORMANCE GOLF Column */}
        <div className="p-1">
          <div className="flex items-center gap-2.5 mb-6 pb-3" style={{ borderBottom: "1px solid rgba(245,158,11,0.1)" }}>
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--neon-amber)", boxShadow: "0 0 6px var(--neon-amber)" }}
            />
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--neon-amber)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.65rem" }}
            >
              Performance Golf
            </span>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full"
              style={{ color: "var(--neon-amber)", background: "rgba(245,158,11,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {pgMessages.length}
            </span>
          </div>
          <div className="space-y-3">
            {pgMessages.map((msg) => (
              <MessageRow key={msg.id} msg={msg} isExpanded={expandedId === msg.id} onToggle={() => toggle(msg.id)} />
            ))}
            {pgMessages.length === 0 && (
              <p className="text-xs py-4" style={{ color: "var(--text-muted)" }}>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MessageRow({
  msg,
  isExpanded,
  onToggle,
}: {
  msg: SlackMessage;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const slackLink = getSlackLink(msg);

  return (
    <div
      className="rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: isExpanded ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        borderLeft: `2px solid ${tierColors[msg.tier] || "var(--glass-border)"}`,
        borderTop: "1px solid var(--glass-border)",
        borderRight: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
      }}
      onClick={onToggle}
    >
      {/* Collapsed row */}
      <div className="flex items-center gap-3 p-4">
        <span className="shrink-0" style={{ color: tierColors[msg.tier] || "var(--text-muted)" }}>
          {getChannelIcon(msg.channel)}
        </span>
        <span className="text-sm font-medium shrink-0" style={{ color: "var(--text-primary)" }}>
          {msg.sender}
        </span>
        <span
          className="text-sm flex-1 min-w-0 truncate"
          style={{ color: "var(--text-muted)", lineHeight: "1.5" }}
        >
          {msg.preview}
        </span>
        <span
          className="text-xs shrink-0 ml-2"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", whiteSpace: "nowrap" }}
        >
          {timeAgo(msg.timestamp)}
        </span>
        <span
          className="text-xs shrink-0 transition-transform duration-200"
          style={{
            color: "var(--text-muted)",
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          &#9656;
        </span>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div
          className="px-4 pb-4 pt-0"
          style={{ borderTop: "1px solid var(--glass-border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-3 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
              >
                {msg.channel}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
                &middot;
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
              >
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
              {msg.full_text || msg.preview}
            </p>
            <div className="flex items-center gap-2">
              {slackLink && (
                <a
                  href={slackLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                  style={{
                    color: "var(--neon-blue)",
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in Slack
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
