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
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#0D0C0C" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,200,0.08), rgba(168,85,247,0.08))",
              border: "1px solid rgba(0,255,200,0.15)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C8.5 2 5 4.5 5 8.5C5 10.5 5.5 11.5 6 12.5C6.5 13.5 7 14.5 7 16V17C7 18.1 7.9 19 9 19H15C16.1 19 17 18.1 17 17V16C17 14.5 17.5 13.5 18 12.5C18.5 11.5 19 10.5 19 8.5C19 4.5 15.5 2 12 2Z"
                stroke="#00ffc8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 22H15" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 19V22" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 19V22" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold tracking-widest uppercase mb-3"
            style={{ color: "#00ffc8" }}
          >
            OPEN BRAIN
          </h1>
          <p className="text-base" style={{ color: "#6B6462" }}>
            Life Operating System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl p-10"
            style={{
              background: "linear-gradient(135deg, #171515, #1F1C1C)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <label
              className="block text-xs uppercase tracking-widest mb-4 font-medium"
              style={{ color: "#B3AAA3", letterSpacing: "0.15em" }}
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
              className="w-full px-5 py-4 rounded-xl text-base outline-none transition-all duration-200 focus:ring-2 focus:ring-[#00ffc8]/30"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                color: "#FCFAFA",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "16px",
              }}
            />
            {error && (
              <p className="mt-3 text-sm font-medium" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full mt-8 px-5 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:translate-y-[-1px]"
              style={{
                background: loading ? "rgba(0,255,200,0.08)" : "rgba(0,255,200,0.12)",
                color: "#00ffc8",
                border: "1px solid rgba(0,255,200,0.2)",
                cursor: loading ? "wait" : "pointer",
                opacity: !password ? 0.4 : 1,
                fontSize: "13px",
              }}
            >
              {loading ? "Authenticating..." : "Enter"}
            </button>
          </div>
        </form>

        <p className="text-center mt-10 text-xs" style={{ color: "#3a3735" }}>
          Secured access only
        </p>
      </div>
    </div>
  );
}
