"use client";

import React, { useEffect, useState } from "react";
import GlassCard from "../ui/GlassCard";
import NeonText from "../ui/NeonText";

interface SlackMessage {
  id: string;
  channel: string;
  sender: string;
  preview: string;
  timestamp: string;
  workspace: string;
  tier: number;
}

const tierColors: Record<number, string> = {
  1: "#ef4444", // red — urgent
  2: "#eab308", // yellow — this week
  3: "var(--text-muted)", // gray — backlog
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

export default function Communications() {
  const [jlMessages, setJlMessages] = useState<SlackMessage[]>([]);
  const [pgMessages, setPgMessages] = useState<SlackMessage[]>([]);

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
    <GlassCard delay={350} className="xl:col-span-2">
      <div className="flex items-center gap-3 mb-5">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* JUMM LIFE Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--neon-cyan)", boxShadow: "0 0 6px var(--neon-cyan)" }}
            />
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--neon-cyan)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem" }}
            >
              Jumm Life
            </span>
          </div>
          <div className="space-y-2">
            {jlMessages.map((msg) => (
              <MessageRow key={msg.id} msg={msg} />
            ))}
            {jlMessages.length === 0 && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
            )}
          </div>
        </div>

        {/* PERFORMANCE GOLF Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--neon-amber)", boxShadow: "0 0 6px var(--neon-amber)" }}
            />
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--neon-amber)", fontFamily: "'Orbitron', sans-serif", fontSize: "0.55rem" }}
            >
              Performance Golf
            </span>
          </div>
          <div className="space-y-2">
            {pgMessages.map((msg) => (
              <MessageRow key={msg.id} msg={msg} />
            ))}
            {pgMessages.length === 0 && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MessageRow({ msg }: { msg: SlackMessage }) {
  return (
    <div
      className="p-2.5 rounded-lg transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderLeft: `2px solid ${tierColors[msg.tier] || "var(--glass-border)"}`,
        borderTop: "1px solid var(--glass-border)",
        borderRight: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
        >
          {msg.channel}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}
        >
          {timeAgo(msg.timestamp)}
        </span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-primary)" }}>
          {msg.sender}:
        </span>
        <span
          className="text-xs line-clamp-2"
          style={{ color: "var(--text-muted)", lineHeight: "1.4" }}
        >
          {msg.preview}
        </span>
      </div>
    </div>
  );
}
