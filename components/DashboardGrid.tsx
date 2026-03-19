"use client";

import React from "react";
import FinancialOverview from "./panels/FinancialOverview";
import PGCommandCenter from "./panels/PGCommandCenter";
import PersonalLife from "./panels/PersonalLife";
import ActiveProjects from "./panels/ActiveProjects";
import PeopleCRM from "./panels/PeopleCRM";
import AIActivity from "./panels/AIActivity";

export default function DashboardGrid() {
  return (
    <section className="px-6 py-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <FinancialOverview />
        <PGCommandCenter />
        <PersonalLife />
        <ActiveProjects />
        <PeopleCRM />
        <AIActivity />
      </div>
    </section>
  );
}
