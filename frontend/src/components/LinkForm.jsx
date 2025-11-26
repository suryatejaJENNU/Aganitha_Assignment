import React, { useState } from "react";
import { createLink } from "../api";
import { useNotification } from "./NotificationProvider";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function LinkForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const validate = () => {
    const e = {};
    if (!url) {
      e.url = "URL is required";
    } else if (!isValidUrl(url)) {
      e.url = "Please enter a valid http(s) URL";
    }

    if (code && !CODE_REGEX.test(code)) {
      e.code = "Code must be 6–8 characters, letters/numbers only.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const newLink = await createLink({ url, code: code || undefined });
      setUrl("");
      setCode("");
      setErrors({});
      if (onCreated) onCreated(newLink);
      showNotification("Short URL created successfully", "success");
    } catch (err) {
      showNotification(err.message || "Failed to create link", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-1 text-gray-900">
        Create a short link
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Paste a long URL and optionally choose a custom code.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 mt-1 text-sm
                       focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="https://example.com/docs"
          />
          {errors.url && (
            <p className="text-xs text-red-600 mt-1">{errors.url}</p>
          )}
        </div>

        {/* Custom code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Custom code (optional)
          </label>
          <div className="flex gap-2 mt-1">
            <span className="hidden sm:block text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
              /your-code
            </span>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g. docs123"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be 6–8 characters (letters and numbers only).
          </p>
          {errors.code && (
            <p className="text-xs text-red-600 mt-1">{errors.code}</p>
          )}
        </div>

       
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
                     shadow hover:bg-indigo-700 disabled:bg-indigo-300 transition"
        >
          {submitting ? "Creating..." : "Shorten URL"}
        </button>
      </form>
    </div>
  );
}
