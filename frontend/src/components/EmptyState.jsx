import React from "react";

export default function EmptyState({ title, description }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-500">
      <p className="font-semibold text-gray-700 mb-1">{title}</p>
      <p>{description}</p>
    </div>
  );
}
