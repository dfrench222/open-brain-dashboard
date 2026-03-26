"use client";

import React, { useEffect, useState } from "react";

interface Quote {
  quote_text: string;
  source_title: string;
  source_author: string;
  category: string;
}

const fallbackQuote: Quote = {
  quote_text: "Whatever you want in life, give it away first.",
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
      .catch(() => {});
  }, []);

  return (
    <section className="animate-fade-in-up">
      <div
        className="rounded-2xl relative overflow-visible"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.025) 0%, rgba(168,85,247,0.025) 50%, rgba(0,255,200,0.025) 100%)",
          border: "1px solid var(--glass-border)",
          padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)",
        }}
      >
        {/* North Star */}
        <div className="text-center mb-8">
          <p
            className="uppercase mb-5 font-medium"
            style={{
              color: "var(--text-muted)",
              letterSpacing: "0.2em",
              fontSize: "0.65rem",
            }}
          >
            North Star Principle
          </p>
          <h2
            className="north-star-text font-bold leading-tight mx-auto"
            style={{
              fontSize: "clamp(1.25rem, 3.5vw, 1.875rem)",
              maxWidth: "36ch",
              lineHeight: 1.35,
            }}
          >
            &ldquo;Whatever you want in life &mdash; give it away first.&rdquo;
          </h2>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-7">
          <div
            className="h-px flex-1 max-w-[60px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,200,0.25))" }}
          />
          <div
            className="w-1.5 h-1.5 rotate-45"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 8px rgba(0,255,200,0.4)",
              opacity: 0.6,
            }}
          />
          <div
            className="h-px flex-1 max-w-[60px]"
            style={{ background: "linear-gradient(270deg, transparent, rgba(0,255,200,0.25))" }}
          />
        </div>

        {/* Daily Quote */}
        <div className="text-center">
          <p
            className="uppercase mb-4 font-medium"
            style={{
              color: "var(--text-muted)",
              letterSpacing: "0.2em",
              fontSize: "0.6rem",
            }}
          >
            Daily Wisdom &mdash; GuruKev Lessons
          </p>
          <blockquote
            className="italic max-w-2xl mx-auto leading-relaxed"
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              lineHeight: 1.75,
            }}
          >
            &ldquo;{quote.quote_text}&rdquo;
          </blockquote>
          <cite
            className="block mt-4 not-italic metric-value"
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
            }}
          >
            &mdash; {quote.source_author}
            {quote.source_title && (
              <span style={{ opacity: 0.5 }}> / {quote.source_title}</span>
            )}
          </cite>
        </div>
      </div>
    </section>
  );
}
