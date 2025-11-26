import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useNotification } from "./NotificationProvider";
import EmptyState from "./EmptyState";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

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

export default function LinksTable({
  links,
  loading,
  error,
  onDelete,
  filter,
  setFilter,
}) {
  const { showNotification } = useNotification();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = (links || []).filter((link) => {
    const text = (filter || "").toLowerCase();
    return (
      link.code.toLowerCase().includes(text) ||
      link.target_url.toLowerCase().includes(text)
    );
  });

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Short URL copied to clipboard", "success");
    } catch {
      showNotification("Failed to copy to clipboard", "error");
    }
  };

  const openConfirm = (code) => {
    setSelectedCode(code);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCode) return;
    setDeleting(true);
    try {
      await onDelete(selectedCode); 
      showNotification("Link deleted successfully", "success");
      setConfirmOpen(false);
      setSelectedCode(null);
    } catch (err) {
      showNotification(err.message || "Failed to delete link", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">All links</h2>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by code or URL..."
          className="w-full md:w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Loading */}
      {loading && !error && (
        <div className="py-10">
          <LoadingSpinner label="Loading links..." />
        </div>
      )}

    
      {!loading && error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="No links yet"
          description="Create a short link using the form above to see it here."
        />
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-100 border-b border-gray-300 z-10">
              <tr className="text-gray-700">
                <th className="text-left px-4 py-2 font-medium">Code</th>
                <th className="text-left px-4 py-2 font-medium">Target URL</th>
                <th className="text-center px-4 py-2 font-medium">Clicks</th>
                <th className="text-left px-4 py-2 font-medium">
                  Last clicked
                </th>
                <th className="text-right px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((link) => (
                <tr
                  key={link.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`/code/${link.code}`}
                        className="text-indigo-600 font-mono text-sm hover:underline"
                      >
                        {link.code}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(link.shortUrl)}
                        className="text-[11px] text-gray-500 hover:text-gray-800 text-left"
                      >
                        Copy short URL
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3 max-w-xs truncate text-gray-700 align-top">
                    <a
                      href={link.target_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {link.target_url}
                    </a>
                  </td>

                  <td className="px-4 py-3 text-center align-top">
                    {link.total_clicks}
                  </td>

                  <td className="px-4 py-3 text-gray-600 align-top">
                    {timeAgo(link.last_clicked_at)}
                  </td>

                  <td className="px-4 py-3 text-right align-top">
                    <button
                      type="button"
                      onClick={() => openConfirm(link.code)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs shadow hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Dialog
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: 600 }}>
          Delete link?
        </DialogTitle>

        <DialogContent sx={{ mt: 1, mb: 2 }}>
          <p className="text-sm text-gray-700 leading-relaxed">
            Are you sure you want to delete the link with code{" "}
            <span className="font-mono font-semibold">{selectedCode}</span>?
            This cannot be undone.
          </p>

          {deleting && (
            <div className="flex items-center justify-center mt-4 mb-2">
              <span className="h-5 w-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></span>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
