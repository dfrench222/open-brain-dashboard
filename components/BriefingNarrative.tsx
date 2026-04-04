"use client";

interface BriefingNarrativeProps {
  narrative: string;
  date: string;
}

export function BriefingNarrative({ narrative, date }: BriefingNarrativeProps) {
  if (!narrative) return null;

  return (
    <div
      className="card"
      style={{
        padding: "20px 24px",
        borderLeft: "3px solid var(--accent)",
      }}
    >
      <div className="label" style={{ marginBottom: "8px", color: "var(--accent)" }}>
        Today at a Glance — {date}
      </div>
      <div
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "var(--text)",
        }}
      >
        {narrative}
      </div>
    </div>
  );
}
