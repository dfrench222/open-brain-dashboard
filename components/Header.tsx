"use client";

import React, { useState, useEffect } from "react";
import NeonText from "./ui/NeonText";

type Context = "all" | "jumm-life" | "performance-golf";

interface HeaderProps {
  context: Context;
  onContextChange: (ctx: Context) => void;
}

export default function Header({ context, onContextChange }: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const contexts: { key: Context; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "jumm-life", label: "JUMM LIFE" },
    { key: "performance-golf", label: "PERFORMANCE GOLF" },
  ];

  return (
    <header
      className="sticky top-0 z-50 px-6 md:px-10 lg:px-16 py-5"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.9) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,200,0.15), rgba(168,85,247,0.15))",
              border: "1px solid rgba(0,255,200,0.2)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C8.5 2 5 4.5 5 8.5C5 10.5 5.5 11.5 6 12.5C6.5 13.5 7 14.5 7 16V17C7 18.1 7.9 19 9 19H15C16.1 19 17 18.1 17 17V16C17 14.5 17.5 13.5 18 12.5C18.5 11.5 19 10.5 19 8.5C19 4.5 15.5 2 12 2Z"
                stroke="var(--neon-cyan)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 22H15" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 19V22" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 19V22" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M12 2V6M8 5L10 7M16 5L14 7"
                stroke="var(--neon-cyan)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
          <div>
            <NeonText size="lg" glow className="block leading-none">
              OPEN BRAIN
            </NeonText>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              Life Operating System
            </span>
          </div>
        </div>

        {/* Context Switcher — Desktop */}
        <div
          className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {contexts.map((ctx) => (
            <button
              key={ctx.key}
              onClick={() => onContextChange(ctx.key)}
              className="px-6 py-2.5 rounded-xl text-sm uppercase tracking-wider font-semibold transition-all duration-200"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.75rem",
                color: context === ctx.key ? "var(--bg-primary)" : "var(--text-secondary)",
                background:
                  context === ctx.key
                    ? "linear-gradient(135deg, var(--neon-cyan), rgba(0,255,200,0.8))"
                    : "transparent",
                boxShadow: context === ctx.key ? "0 0 20px rgba(0,255,200,0.35), 0 0 40px rgba(0,255,200,0.1)" : "none",
              }}
            >
              {ctx.label}
            </button>
          ))}
        </div>

        {/* Right side — Time + Avatar */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div
              className="text-lg font-medium tracking-wider"
              style={{
                color: "var(--neon-cyan)",
                fontFamily: "'JetBrains Mono', monospace",
                textShadow: "0 0 10px rgba(0,255,200,0.3)",
              }}
            >
              {time}
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {date}
            </div>
          </div>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))",
              color: "var(--bg-primary)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.7rem",
            }}
          >
            DF
          </div>

          {/* Hamburger — Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-2"
          >
            <span className="w-5 h-0.5 rounded" style={{ background: "var(--neon-cyan)" }} />
            <span className="w-5 h-0.5 rounded" style={{ background: "var(--neon-cyan)" }} />
            <span className="w-3 h-0.5 rounded" style={{ background: "var(--neon-cyan)" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-4 p-3 rounded-xl"
          style={{
            background: "rgba(17,17,24,0.95)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {contexts.map((ctx) => (
            <button
              key={ctx.key}
              onClick={() => {
                onContextChange(ctx.key);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-medium transition-all"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "0.65rem",
                color: context === ctx.key ? "var(--neon-cyan)" : "var(--text-secondary)",
                background: context === ctx.key ? "rgba(0,255,200,0.08)" : "transparent",
              }}
            >
              {ctx.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
