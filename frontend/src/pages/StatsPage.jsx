import React, { useEffect, useState, useCallback } from "react";
import { fetchLinkStats } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNotification } from "../components/NotificationProvider";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL || "https://aganitha-assignment.onrender.com");


function timeAgo(dateString) {
  if (!dateString) return "Never";

  const now = Date.now();
  const t = new Date(dateString).getTime();
  const diff = (now - t) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} days ago`;

  return new Date(dateString).toLocaleDateString();
}

export default function StatsPage() {
  const [code, setCode] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showNotification } = useNotification();

  // Load current code
  useEffect(() => {
    const match = window.location.pathname.match(/^\/code\/([A-Za-z0-9]{6,8})$/);
    if (match) setCode(match[1]);
    else setError("Invalid stats URL");
  }, []);

  // API loader
  const loadStats = useCallback(async () => {
    if (!code) return;

    try {
      setLoading(true);
      const data = await fetchLinkStats(code);
      setLink(data);
    } catch (err) {
      const msg = err.message || "Failed to load stats";
      setError(msg);
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [code, showNotification]);

  // Initial + Socket updates
  useEffect(() => {
    if (!code) return;

    loadStats(); // initial load

    socket.on("click_updated", (data) => {
      if (data.code === code) loadStats();
    });

    return () => socket.off("click_updated");
  }, [code, loadStats]);

  // Copy button
  const handleCopy = async () => {
    if (!link?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      showNotification("Short URL copied", "success");
    } catch {
      showNotification("Failed to copy", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <header className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Link stats</h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Detailed metrics for a single short link.
        </p>
      </header>

      {/* --- BACK BUTTON --- */}
      <button
        onClick={() => (window.location.href = "/")}
        className="text-xs text-indigo-600 hover:text-indigo-800"
      >
        ← Back to dashboard
      </button>

      {/* --- LOADING --- */}
      {loading && <LoadingSpinner label="Loading stats..." />}

      {/* --- ERROR --- */}
      {!loading && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* --- MAIN CONTENT --- */}
      {!loading && !error && link && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          {/* SHORT URL */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-indigo-600 text-sm break-all">
              {link.shortUrl}
            </span>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-indigo-500 text-white rounded-md 
                         text-xs hover:bg-indigo-400 transition"
            >
              Copy
            </button>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT CARD — keep same UI */}
            <div className="bg-slate-800 text-white rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold">Target URL</p>
              <a
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline break-all hover:text-indigo-300"
              >
                {link.target_url}
              </a>
            </div>

            {/* RIGHT CARD — keep same UI */}
            <div className="bg-slate-800 text-white rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold">Stats</p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-300 mb-1">Total clicks</p>
                  <p className="text-lg font-semibold text-white">
                    {link.total_clicks}
                  </p>
                </div>

                <div>
                  <p className="text-slate-300 mb-1">Created at</p>
                  <p>{new Date(link.created_at).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-slate-300 mb-1">Last clicked</p>
                  <p>{timeAgo(link.last_clicked_at)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
