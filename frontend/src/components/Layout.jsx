import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-500 bg-white mt-6">
        TinyLink • Built with React, Express &amp; Neon Postgres
      </footer>
    </div>
  );
}
