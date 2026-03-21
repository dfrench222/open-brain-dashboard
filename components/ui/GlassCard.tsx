"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  delay = 0,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card animate-fade-in-up p-6 ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {children}
    </div>
  );
}
