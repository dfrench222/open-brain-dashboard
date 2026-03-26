"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar({ taskCount }: { taskCount?: number }) {
  const pathname = usePathname();
  const [date, setDate] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    setDate(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Overview",
      href: "/",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Action",
      href: "/action",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      badge: taskCount,
    },
    {
      label: "Jumm Life",
      href: "/jumm-life",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: "Performance Golf",
      href: "/performance-golf",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      label: "Communications",
      href: "/communications",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "People",
      href: "/people",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Projects",
      href: "/projects",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      label: "Knowledge",
      href: "/knowledge",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.92L12 10v2" />
          <circle cx="12" cy="16" r="2" />
          <path d="M12 18v2" />
          <path d="M8 22h8" />
          <path d="M7 6a4 4 0 0 1 .8-2.4" />
          <path d="M17 6a4 4 0 0 0-.8-2.4" />
        </svg>
      ),
    },
  ];

  const mobileItems = navItems.filter((item) =>
    ["/", "/action", "/communications", "/people", "/knowledge"].includes(item.href)
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{
          width: "var(--sidebar-width)",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Logo area */}
        <div className="px-5 pt-7 pb-3">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,200,0.1), rgba(168,85,247,0.1))",
                border: "1px solid rgba(0,255,200,0.18)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.5 2 5 4.5 5 8.5C5 10.5 5.5 11.5 6 12.5C6.5 13.5 7 14.5 7 16V17C7 18.1 7.9 19 9 19H15C16.1 19 17 18.1 17 17V16C17 14.5 17.5 13.5 18 12.5C18.5 11.5 19 10.5 19 8.5C19 4.5 15.5 2 12 2Z"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M9 22H15" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span
              className="text-sm font-bold tracking-wider uppercase"
              style={{ color: "var(--accent)", letterSpacing: "0.12em" }}
            >
              OPEN BRAIN
            </span>
          </div>
          <p
            className="text-xs pl-0.5 mt-3"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
            }}
          >
            {date}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 my-2 h-px" style={{ background: "var(--border)" }} />

        {/* Nav */}
        <nav className="flex-1 px-3 pt-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative group"
                  style={{
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    background: active ? "rgba(0,255,200,0.06)" : "transparent",
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                  <span style={{ opacity: active ? 1 : 0.55 }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        color: "var(--neon-red)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: "var(--neon-green)", boxShadow: "0 0 6px var(--neon-green)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
              All systems ok
            </span>
          </div>
          <span
            className="text-xs block"
            style={{
              color: "var(--text-muted)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.55rem",
              opacity: 0.5,
            }}
          >
            Built {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </aside>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          background: "rgba(13,12,12,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "68px",
        }}
      >
        {mobileItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative"
              style={{
                color: active ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {item.icon}
              <span className="text-xs" style={{ fontSize: "0.55rem", fontWeight: active ? 500 : 400 }}>
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="absolute -top-0.5 right-0 text-xs font-bold px-1 rounded-full min-w-[16px] text-center"
                  style={{
                    background: "var(--neon-red)",
                    color: "var(--bg-primary)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.5rem",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        {/* More menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2"
          style={{ color: mobileOpen ? "var(--accent)" : "var(--text-muted)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
          <span className="text-xs" style={{ fontSize: "0.55rem" }}>More</span>
        </button>
      </nav>

      {/* ─── Mobile Overflow Menu ─── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute bottom-[68px] left-0 right-0 px-4 py-3"
            style={{
              background: "rgba(17,16,16,0.98)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border)",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              {navItems
                .filter((item) => !mobileItems.some((m) => m.href === item.href))
                .map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
                      style={{
                        color: active ? "var(--accent)" : "var(--text-secondary)",
                        background: active ? "rgba(0,255,200,0.06)" : "transparent",
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
