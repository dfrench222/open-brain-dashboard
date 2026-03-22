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
        className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,200,0.03) 0%, rgba(168,85,247,0.03) 50%, rgba(0,255,200,0.03) 100%)",
          border: "1px solid var(--border)",
        }}
      >
        {/* North Star */}
        <div className="text-center mb-8">
          <p
            className="text-xs uppercase mb-4 tracking-widest font-medium"
            style={{ color: "var(--text-muted)", letterSpacing: "0.2em", fontSize: "0.65rem" }}
          >
            North Star Principle
          </p>
          <h2
            className="north-star-text text-xl sm:text-2xl md:text-3xl font-bold leading-tight"
          >
            &ldquo;Whatever you want in life &mdash; give it away first.&rdquo;
          </h2>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }} />
          <div
            className="w-1.5 h-1.5 rotate-45"
            style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }}
          />
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(270deg, transparent, var(--accent))" }} />
        </div>

        {/* Daily Quote */}
        <div className="text-center">
          <p
            className="text-xs uppercase mb-3 tracking-widest font-medium"
            style={{ color: "var(--text-muted)", letterSpacing: "0.2em", fontSize: "0.6rem" }}
          >
            Daily Wisdom &mdash; GuruKev Lessons
          </p>
          <blockquote
            className="text-base sm:text-lg italic max-w-2xl mx-auto leading-relaxed"
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
