import React from "react";

export default function Header() {
  // detect current route
  const path = window.location.pathname;

  const isActive = (route) =>
    route === path
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
      : "text-gray-600 hover:text-gray-900";

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* Left Branding */}
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shadow">
            T
          </span>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">TinyLink</h1>
            <p className="text-xs text-gray-500">
              Minimal URL shortener with stats
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex items-center gap-5 text-sm">
          <a
            href="/"
            className={`${isActive("/")}`}
          >
            Dashboard
          </a>

          <a
            href="/health"
            className={`${isActive("/health")}`}
          >
            Health
          </a>
        </nav>
      </div>
    </header>
  );
}
