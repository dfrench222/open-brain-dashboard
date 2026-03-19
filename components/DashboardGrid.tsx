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
    <div className="max-w-[1600px] mx-auto">
      {/* COMMUNICATIONS Section */}
      <section className="mb-14 md:mb-20">
        <SectionLabel label="Communications" color="var(--neon-blue)" />
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <Communications />
        </div>
      </section>

      {/* OPERATIONS Section */}
      <section className="mb-14 md:mb-20">
        <SectionLabel label="Operations" color="var(--neon-cyan)" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <FinancialOverview />
          <PGCommandCenter />
        </div>
      </section>

      {/* PERSONAL Section */}
      <section className="mb-14 md:mb-20">
        <SectionLabel label="Personal" color="var(--neon-purple)" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <PersonalLife />
          <PeopleCRM />
        </div>
      </section>

      {/* SYSTEM Section */}
      <section className="mb-8">
        <SectionLabel label="System" color="var(--neon-green)" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <ActiveProjects />
          <AIActivity />
        </div>
      </section>
    </div>
  );
}
