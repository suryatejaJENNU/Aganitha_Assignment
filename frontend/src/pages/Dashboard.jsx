import React, { useEffect, useState, useCallback } from "react";
import { fetchLinks, deleteLink } from "../api";
import LinkForm from "../components/LinkForm";
import LinksTable from "../components/LinksTable";
import { useNotification } from "../components/NotificationProvider";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:4000");

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const { showNotification } = useNotification();

  const loadLinks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLinks();
      setLinks(data);
      setError("");
    } catch (err) {
      const msg = err.message || "Failed to load links";
      setError(msg);
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadLinks(); 

    
    socket.on("click_updated", () => {
      loadLinks();
    });

    return () => {
      socket.off("click_updated");
    };
  }, [loadLinks]);

  const handleCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleDelete = async (code) => {
    await deleteLink(code);
    setLinks((prev) => prev.filter((l) => l.code !== code));
  };

  return (
    <div className="space-y-5">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Manage all short links.</p>
      </header>

      <LinkForm onCreated={handleCreated} />

      <LinksTable
        links={links}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}
