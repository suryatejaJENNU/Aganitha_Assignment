import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/healthz`);
        if (!res.ok) throw new Error("Failed to fetch health status");
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setError(err.message || "Unable to load healthcheck");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">System health</h1>
        <p className="text-xs text-gray-500 mt-1">
          Backend health status and uptime information.
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl">
        {loading && <LoadingSpinner label="Checking health..." />}

        {!loading && error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && health && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium">
                {health.ok ? " OK" : " DOWN"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Version</dt>
              <dd className="font-medium">{health.version}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Uptime (seconds)</dt>
              <dd className="font-medium">
                {health.uptime?.toFixed
                  ? health.uptime.toFixed(2)
                  : health.uptime}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Timestamp</dt>
              <dd className="font-medium">{health.timestamp}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
