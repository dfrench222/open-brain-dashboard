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
    // Fetch task count for the sidebar badge
    fetch("/api/clickup")
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks && Array.isArray(data.tasks)) {
          const active = data.tasks.filter(
            (t: { status: string }) => t.status !== "Closed" && t.status !== "hold for launch"
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
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>
      <Sidebar taskCount={taskCount} />
      {/* Main content area offset by sidebar width on desktop */}
      <main
        className="md:ml-[220px] pb-20 md:pb-8"
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
