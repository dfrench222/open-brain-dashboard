"use client";

import React from "react";
import Communications from "./panels/Communications";
import FinancialOverview from "./panels/FinancialOverview";
import PGCommandCenter from "./panels/PGCommandCenter";
import PersonalLife from "./panels/PersonalLife";
import ActiveProjects from "./panels/ActiveProjects";
import PeopleCRM from "./panels/PeopleCRM";
import AIActivity from "./panels/AIActivity";

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div className="section-label">
      <span style={{ color }}>{label}</span>
    </div>
  );
}

export default function DashboardGrid() {
  return (
    <div className="max-w-[1440px] mx-auto">
      {/* COMMUNICATIONS Section */}
      <section style={{ marginBottom: "40px" }}>
        <SectionLabel label="Communications" color="var(--neon-blue)" />
        <div className="grid grid-cols-1" style={{ gap: "24px" }}>
          <Communications />
        </div>
      </section>

      {/* OPERATIONS Section */}
      <section style={{ marginBottom: "40px" }}>
        <SectionLabel label="Operations" color="var(--neon-cyan)" />
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "24px" }}>
          <FinancialOverview />
          <PGCommandCenter />
        </div>
      </section>

      {/* PERSONAL Section */}
      <section style={{ marginBottom: "40px" }}>
        <SectionLabel label="Personal" color="var(--neon-purple)" />
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "24px" }}>
          <PersonalLife />
          <PeopleCRM />
        </div>
      </section>

      {/* SYSTEM Section */}
      <section style={{ marginBottom: "40px" }}>
        <SectionLabel label="System" color="var(--neon-green)" />
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "24px" }}>
          <ActiveProjects />
          <AIActivity />
        </div>
      </section>
    </div>
  );
}
