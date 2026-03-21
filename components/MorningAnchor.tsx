"use client";

import React, { useEffect, useState } from "react";

interface Quote {
  quote_text: string;
  source_title: string;
  source_author: string;
  category: string;
}

const fallbackQuote: Quote = {
  quote_text:
    "Whatever you want in life, give it away first.",
  source_title: "Affirmations Of Truth",
  source_author: "Kevin Trudeau",
  category: "giving",
};

export default function MorningAnchor() {
  const [quote, setQuote] = useState<Quote>(fallbackQuote);

  useEffect(() => {
    fetch("/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        if (data.quote_text) setQuote(data);
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  return (
    <section className="animate-fade-in-up relative pt-10 md:pt-14 pb-2">
      <div
        className="max-w-[1440px] mx-auto rounded-2xl p-8 md:p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.03) 0%, rgba(168,85,247,0.03) 50%, rgba(0,255,200,0.03) 100%)",
          border: "1px solid rgba(179, 170, 163, 0.08)",
        }}
      >
        {/* Decorative corner accents */}
        <div
          className="absolute top-0 left-0 w-20 h-20"
          style={{
            borderTop: "2px solid var(--neon-cyan)",
            borderLeft: "2px solid var(--neon-cyan)",
            borderTopLeftRadius: "16px",
            opacity: 0.3,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-20 h-20"
          style={{
            borderBottom: "2px solid var(--neon-purple)",
            borderRight: "2px solid var(--neon-purple)",
            borderBottomRightRadius: "16px",
            opacity: 0.3,
          }}
        />

        {/* North Star */}
        <div className="text-center" style={{ marginBottom: "32px" }}>
          <p
            className="text-xs uppercase mb-5"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
            }}
          >
            North Star Principle
          </p>
          <h2
            className="north-star-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            &ldquo;Whatever you want in life &mdash; give it away first.&rdquo;
          </h2>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4" style={{ margin: "32px 0" }}>
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
            className="text-xs uppercase mb-4"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
            }}
          >
            Daily Wisdom &mdash; GuruKev Lessons
          </p>
          <blockquote
            className="text-lg sm:text-xl italic max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
          >
            &ldquo;{quote.quote_text}&rdquo;
          </blockquote>
          <cite
            className="block mt-3 text-sm not-italic metric-value"
            style={{ color: "var(--text-muted)" }}
          >
            &mdash; {quote.source_author}
            {quote.source_title && (
              <span style={{ opacity: 0.6 }}> / {quote.source_title}</span>
            )}
          </cite>
        </div>
      </div>
    </section>
  );
}
