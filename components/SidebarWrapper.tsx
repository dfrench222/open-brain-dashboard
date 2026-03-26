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
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>
      <Sidebar taskCount={taskCount} />
      <main
        className="pb-24 md:pb-10"
        style={{
          marginLeft: "0",
          minHeight: "100vh",
        }}
      >
        <div
          className="mx-auto px-5 pt-6 md:pt-8 md:px-10 lg:px-12"
          style={{
            marginLeft: "0",
            maxWidth: "1200px",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              main { margin-left: var(--sidebar-width) !important; }
              main > div { margin-left: 0 !important; }
            }
          `}</style>
          {children}
        </div>
      </main>
    </div>
  );
}
