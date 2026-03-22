"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid password");
        setPassword("");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,200,0.1), rgba(168,85,247,0.1))",
              border: "1px solid rgba(0,255,200,0.2)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C8.5 2 5 4.5 5 8.5C5 10.5 5.5 11.5 6 12.5C6.5 13.5 7 14.5 7 16V17C7 18.1 7.9 19 9 19H15C16.1 19 17 18.1 17 17V16C17 14.5 17.5 13.5 18 12.5C18.5 11.5 19 10.5 19 8.5C19 4.5 15.5 2 12 2Z"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 22H15" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 19V22" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 19V22" stroke="var(--neon-purple)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-wider uppercase mb-2"
            style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
          >
            OPEN BRAIN
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Life Operating System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="glass-card p-8"
          >
            <label
              className="block text-xs uppercase tracking-widest mb-3 font-medium"
              style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: error ? "1px solid var(--neon-red)" : "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            {error && (
              <p className="mt-2 text-xs" style={{ color: "var(--neon-red)" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full mt-5 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200"
              style={{
                background: loading ? "rgba(0,255,200,0.1)" : "rgba(0,255,200,0.15)",
                color: "var(--accent)",
                border: "1px solid rgba(0,255,200,0.25)",
                cursor: loading ? "wait" : "pointer",
                opacity: !password ? 0.5 : 1,
              }}
            >
              {loading ? "Authenticating..." : "Enter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
