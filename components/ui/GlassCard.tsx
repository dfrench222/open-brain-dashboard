"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "var(--neon-cyan)",
  delay = 0,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card animate-fade-in-up p-6 ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        boxShadow: `0 0 1px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      {children}
    </div>
  );
}
