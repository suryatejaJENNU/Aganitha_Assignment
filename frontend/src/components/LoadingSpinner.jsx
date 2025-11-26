import React from "react";

export default function LoadingSpinner({ label }) {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
      <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin" />
      {label && <span>{label}</span>}
    </div>
  );
}
