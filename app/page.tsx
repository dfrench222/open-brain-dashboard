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
      <main className="pb-12">
        <MorningAnchor />
        <NotificationBar />
        <div className="mt-6">
          <DashboardGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <div className="max-w-[1600px] mx-auto">
          <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, var(--glass-border), transparent)" }} />
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
