import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import HealthPage from "./pages/HealthPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Stats page */}
        <Route path="/code/:code" element={<StatsPage />} />

        {/* Health page */}
        <Route path="/health" element={<HealthPage />} />

        {/* 404 fallback (optional) */}
        <Route
          path="*"
          element={
            <div className="p-6 text-center text-gray-600">
              <h2 className="text-xl font-semibold">404 - Page Not Found</h2>
              <p className="mt-2">The page you’re looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
