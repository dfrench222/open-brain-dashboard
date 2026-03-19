"use client";

import React from "react";

interface NeonTextProps {
  children: React.ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  glow?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const sizeClasses = {
  sm: "text-xs tracking-wider",
  md: "text-base tracking-wider",
  lg: "text-xl tracking-wide",
  xl: "text-3xl tracking-wide",
  "2xl": "text-4xl tracking-wide",
};

export default function NeonText({
  children,
  color = "var(--neon-cyan)",
  size = "md",
  glow = false,
  className = "",
  as: Tag = "span",
}: NeonTextProps) {
  return (
    <Tag
      className={`font-semibold uppercase ${sizeClasses[size]} ${
        glow ? "animate-pulse-glow" : ""
      } ${className}`}
      style={{
        color,
        textShadow: glow
          ? undefined
          : `0 0 10px ${color}40, 0 0 20px ${color}20`,
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      {children}
    </Tag>
  );
}
