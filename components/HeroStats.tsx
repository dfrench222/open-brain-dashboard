"use client";

interface HeroStatsProps {
  meetingsToday: number;
  focusHours: number;
  actionCount: number;
  hasOverdue: boolean;
}

export function HeroStats({
  meetingsToday,
  focusHours,
  actionCount,
  hasOverdue,
}: HeroStatsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      {/* Meetings Today */}
      <div
        className="card"
        style={{
          padding: "20px 24px",
          background: `linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-card) 100%)`,
          borderColor: "var(--accent)",
          borderWidth: "1px",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--accent)",
          }}
        >
          {meetingsToday}
        </div>
        <div className="label" style={{ marginTop: "6px" }}>
          Meetings Today
        </div>
      </div>

      {/* Focus Hours */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <div
          className="mono"
          style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--text-bright)",
          }}
        >
          {focusHours}h
        </div>
        <div className="label" style={{ marginTop: "6px" }}>
          Focus Hours Available
        </div>
      </div>

      {/* Action Items */}
      <div
        className="card"
        style={{
          padding: "20px 24px",
          background: hasOverdue
            ? `linear-gradient(135deg, rgba(240,68,56,0.06) 0%, var(--bg-card) 100%)`
            : `linear-gradient(135deg, rgba(50,213,131,0.04) 0%, var(--bg-card) 100%)`,
          borderColor: hasOverdue
            ? "rgba(240,68,56,0.4)"
            : "rgba(50,213,131,0.3)",
          borderWidth: "1px",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1,
            color: hasOverdue ? "var(--red)" : "var(--green)",
          }}
        >
          {actionCount}
        </div>
        <div className="label" style={{ marginTop: "6px" }}>
          Action Items
        </div>
      </div>
    </div>
  );
}
