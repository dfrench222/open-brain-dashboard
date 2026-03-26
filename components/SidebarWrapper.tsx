"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    if (isLoginPage) return;
    fetch("/api/clickup")
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks && Array.isArray(data.tasks)) {
          const active = data.tasks.filter(
            (t: { status: string }) =>
              t.status !== "Closed" && t.status !== "hold for launch"
          );
          setTaskCount(active.length);
        }
      })
      .catch(() => {});
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <Sidebar taskCount={taskCount} />
      <main
        className="min-h-screen pb-28 md:pb-12"
        style={{ marginLeft: 0 }}
      >
        <div
          className="px-6 py-8 md:px-12 md:py-10 lg:px-16 xl:px-20"
        >
          {children}
        </div>
      </main>
      <style>{`
        @media (min-width: 768px) {
          main {
            margin-left: var(--sidebar-w) !important;
            max-width: calc(100vw - var(--sidebar-w)) !important;
            overflow-x: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}
