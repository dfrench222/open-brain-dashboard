"use client";

import React from "react";

const dailyQuotes = [
  {
    text: "The one thing every successful person uses, and every unsuccessful person does not use.",
    source: "GuruKev Lessons",
  },
  {
    text: "Your income is determined by the number of people you serve and how well you serve them.",
    source: "Bob Burg",
  },
  {
    text: "The map is not the territory. The menu is not the meal.",
    source: "Rich Schefren",
  },
  {
    text: "Speed of implementation is the #1 predictor of success.",
    source: "KT Wisdom",
  },
  {
    text: "You don't rise to the level of your goals. You fall to the level of your systems.",
    source: "James Clear",
  },
  {
    text: "The bottleneck is never the technology. It's always the thinking.",
    source: "Rich Schefren",
  },
  {
    text: "If you want to go fast, go alone. If you want to go far, go together.",
    source: "African Proverb",
  },
];

export default function MorningAnchor() {
  // Rotate quote daily based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = dailyQuotes[dayOfYear % dailyQuotes.length];

  return (
    <section className="animate-fade-in-up relative px-6 py-8">
      <div
        className="max-w-[1600px] mx-auto rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.03) 0%, rgba(168,85,247,0.03) 50%, rgba(0,255,200,0.03) 100%)",
          border: "1px solid rgba(0,255,200,0.1)",
        }}
      >
        {/* Decorative corner accents */}
        <div
          className="absolute top-0 left-0 w-20 h-20"
          style={{
            borderTop: "2px solid var(--neon-cyan)",
            borderLeft: "2px solid var(--neon-cyan)",
            borderTopLeftRadius: "16px",
            opacity: 0.4,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-20 h-20"
          style={{
            borderBottom: "2px solid var(--neon-purple)",
            borderRight: "2px solid var(--neon-purple)",
            borderBottomRightRadius: "16px",
            opacity: 0.4,
          }}
        />

        {/* North Star */}
        <div className="text-center mb-6">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.6rem",
            }}
          >
            North Star Principle
          </p>
          <h2
            className="north-star-text text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            &ldquo;Whatever you want in life &mdash; give it away first.&rdquo;
          </h2>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, transparent, var(--neon-cyan))" }} />
          <div
            className="w-2 h-2 rotate-45"
            style={{ background: "var(--neon-cyan)", boxShadow: "0 0 10px var(--neon-cyan)" }}
          />
          <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(270deg, transparent, var(--neon-cyan))" }} />
        </div>

        {/* Daily Quote */}
        <div className="text-center">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.55rem",
            }}
          >
            Daily Wisdom
          </p>
          <blockquote
            className="text-base sm:text-lg italic max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <cite
            className="block mt-2 text-xs not-italic"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            &mdash; {quote.source}
          </cite>
        </div>
      </div>
    </section>
  );
}
