"use client";

import { logAction } from "@/lib/logAction";

interface SlackMessage {
  id: string;
  external_id: string;
  channel_name: string;
  sender_name: string;
  preview: string;
  timestamp: string;
  workspace: string;
  source: string;
}

interface SlackTier1Props {
  messages: SlackMessage[];
  onDismiss?: (id: string) => void;
}

export function SlackTier1({ messages, onDismiss }: SlackTier1Props) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div className="label" style={{ marginBottom: "16px", color: "var(--red)" }}>
        Slack — Needs Attention
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {messages.map((msg) => {
          const ts = new Date(msg.timestamp);
          const now = new Date();
          const hoursAgo = Math.round(
            (now.getTime() - ts.getTime()) / (1000 * 60 * 60)
          );
          const timeStr =
            hoursAgo < 1
              ? "just now"
              : hoursAgo < 24
              ? `${hoursAgo}h ago`
              : `${Math.round(hoursAgo / 24)}d ago`;
          const isJL = msg.workspace === "jumm-life";

          return (
            <div
              key={msg.id || msg.external_id}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(240,68,56,0.15)",
                background: "rgba(240,68,56,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: isJL
                      ? "rgba(50,213,131,0.1)"
                      : "rgba(253,51,0,0.1)",
                    color: isJL ? "var(--green)" : "#FD3300",
                  }}
                >
                  {isJL ? "JL" : "PG"}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                  {msg.channel_name}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>
                  {msg.sender_name}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: "11px", color: "var(--text-faint)", marginLeft: "auto" }}
                >
                  {timeStr}
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text)",
                  lineHeight: 1.5,
                  marginBottom: "8px",
                }}
              >
                {msg.preview}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => {
                    logAction("reply_slack", "synced_messages", msg.external_id, {
                      channel: msg.channel_name,
                      sender: msg.sender_name,
                    });
                    // Open Slack deep link
                    const domain = isJL ? "jumm-life" : "performance-golf";
                    window.open(
                      `https://${domain}.slack.com/archives/${msg.channel_name}`,
                      "_blank"
                    );
                  }}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    cursor: "pointer",
                  }}
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    logAction("dismiss_slack", "synced_messages", msg.external_id, {
                      channel: msg.channel_name,
                    });
                    onDismiss?.(msg.id || msg.external_id);
                  }}
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "var(--bg-hover)",
                    color: "var(--text-dim)",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
