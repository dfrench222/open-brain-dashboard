"use client";

export function LoadingSkeleton({
  lines = 3,
  height,
}: {
  lines?: number;
  height?: string;
}) {
  return (
    <div className="card" style={{ padding: "24px", height }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? "20px" : "14px",
            width: i === 0 ? "60%" : `${70 + Math.random() * 30}%`,
            borderRadius: "6px",
            background: "var(--bg-hover)",
            marginBottom: i < lines - 1 ? "12px" : 0,
            animation: "shimmer 1.5s ease-in-out infinite",
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}
