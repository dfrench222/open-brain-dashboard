"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import MorningAnchor from "@/components/MorningAnchor";
import NotificationBar from "@/components/NotificationBar";
import DashboardGrid from "@/components/DashboardGrid";

type Context = "all" | "jumm-life" | "performance-golf";

export default function Home() {
  const [context, setContext] = useState<Context>("all");

  return (
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>
      <Header context={context} onContextChange={setContext} />
      <main className="pb-16 px-4 md:px-10 lg:px-16">
        <div className="mb-10 md:mb-14">
          <MorningAnchor />
        </div>
        <div className="mb-10 md:mb-14">
          <NotificationBar />
        </div>
        <DashboardGrid />
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-10 lg:px-16 py-10 text-center">
        <div className="max-w-[1600px] mx-auto">
          <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, transparent, var(--glass-border), transparent)" }} />
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
          >
            OPEN BRAIN v1.0 &middot; Built with Next.js &middot; Supabase &middot; Deployed on Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}
