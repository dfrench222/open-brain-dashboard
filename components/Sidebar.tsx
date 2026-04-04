"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Overview", href: "/", icon: "⌂" },
  { label: "Action", href: "/action", icon: "◉", hasBadge: true },
  { label: "Jumm Life", href: "/jumm-life", icon: "♡" },
  { label: "Performance Golf", href: "/performance-golf", icon: "◎" },
  { label: "Communications", href: "/communications", icon: "◫" },
  { label: "People", href: "/people", icon: "◔" },
  { label: "Projects", href: "/projects", icon: "▦" },
  { label: "Knowledge", href: "/knowledge", icon: "◈" },
];

const MOBILE_NAV = ["/", "/action", "/communications", "/people", "/knowledge"];

export default function Sidebar({ taskCount }: { taskCount?: number }) {
  const pathname = usePathname();
  const [date, setDate] = useState("");
  const [mobileMore, setMobileMore] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [engineStatus, setEngineStatus] = useState<{ fresh: boolean; lastUpdated: string } | null>(null);

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    // Load saved theme
    const saved = localStorage.getItem("ob-theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }

    // Fetch engine status
    fetch("/api/engine-status").then(r => r.json()).then(d => {
      if (d.last_cycle) {
        const completed = d.last_cycle.completed_at;
        const hoursAgo = completed ? (Date.now() - new Date(completed).getTime()) / (1000 * 60 * 60) : 999;
        setEngineStatus({
          fresh: hoursAgo < 6,
          lastUpdated: completed ? new Date(completed).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }) : "unknown",
        });
      }
    }).catch(() => {});
  }, []);

  const THEMES = ["dark", "neon", "terminal", "light"];
  const THEME_ICONS: Record<string, string> = { dark: "☾", neon: "⚡", terminal: "▶", light: "☀" };

  const toggleTheme = () => {
    const idx = THEMES.indexOf(theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ob-theme", next);
  };

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{
          width: "var(--sidebar-w)",
          background: "var(--bg-raised)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-glow)" }}
            >
              <span style={{ color: "var(--accent)", fontSize: "14px" }}>◆</span>
            </div>
            <span
              className="font-semibold tracking-wide uppercase"
              style={{ color: "var(--accent)", fontSize: "13px", letterSpacing: "0.08em" }}
            >
              Open Brain
            </span>
          </div>
          <p className="mono mt-3" style={{ color: "var(--text-faint)", fontSize: "11px" }}>{date}</p>
        </div>

        <div className="mx-6 h-px" style={{ background: "var(--border)" }} />

        <nav className="flex-1 px-4 pt-4 overflow-y-auto">
          {NAV.map((item) => {
            const isActive = active(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors duration-150"
                style={{
                  color: isActive ? "var(--text-bright)" : "var(--text-dim)",
                  background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                  fontSize: "14px",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <span style={{ fontSize: "15px", opacity: isActive ? 0.9 : 0.4, width: "22px", textAlign: "center" }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.hasBadge && taskCount !== undefined && taskCount > 0 && (
                  <span
                    className="ml-auto mono rounded-md px-1.5 py-0.5"
                    style={{
                      background: "rgba(240,68,56,0.1)",
                      color: "var(--red)",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {taskCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-5" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Health + Last Updated */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: engineStatus?.fresh ? "var(--green)" : "var(--amber)" }}
            />
            <span style={{ color: "var(--text-faint)", fontSize: "12px" }}>
              {engineStatus
                ? engineStatus.fresh
                  ? `Updated ${engineStatus.lastUpdated}`
                  : `Stale — last ${engineStatus.lastUpdated}`
                : "Checking..."}
            </span>
          </div>

          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--text-faint)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {theme}
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-lg transition-colors duration-200"
              style={{
                padding: "6px 10px",
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-dim)",
                fontSize: "13px",
                cursor: "pointer",
              }}
              title={`Switch theme (${THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]})`}
            >
              {THEME_ICONS[theme] || "☾"}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          background: "rgba(12,11,11,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "64px",
        }}
      >
        {NAV.filter((n) => MOBILE_NAV.includes(n.href)).map((item) => {
          const isActive = active(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5"
              style={{ color: isActive ? "var(--accent)" : "var(--text-faint)", fontSize: "16px" }}
            >
              <span>{item.icon}</span>
              <span style={{ fontSize: "10px", fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMore(!mobileMore)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5"
          style={{ color: mobileMore ? "var(--accent)" : "var(--text-faint)" }}
        >
          <span style={{ fontSize: "16px" }}>⋮</span>
          <span style={{ fontSize: "10px" }}>More</span>
        </button>
      </nav>

      {mobileMore && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileMore(false)}>
          <div
            className="absolute bottom-[64px] left-0 right-0 p-4"
            style={{ background: "rgba(21,19,19,0.98)", borderTop: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {NAV.filter((n) => !MOBILE_NAV.includes(n.href)).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMore(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{ color: active(item.href) ? "var(--accent)" : "var(--text)", fontSize: "14px" }}
              >
                <span style={{ opacity: 0.5 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
