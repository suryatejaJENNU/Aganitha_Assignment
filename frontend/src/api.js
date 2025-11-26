export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";



export async function fetchLinks() {
  const res = await fetch(`${API_BASE_URL}/api/links`);
  if (!res.ok) {
    throw new Error("Failed to fetch links");
  }
  return res.json();
}

export async function createLink({ url, code }) {
  const res = await fetch(`${API_BASE_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, code }),
  });

  if (res.status === 409) {
    const data = await res.json();
    throw new Error(data.error || "Code already exists");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to create link");
  }

  return res.json();
}

export async function deleteLink(code) {
  const res = await fetch(`${API_BASE_URL}/api/links/${code}`, {
    method: "DELETE",
  });

  if (res.status === 404) {
    throw new Error("Code not found");
  }

  if (!res.ok) {
    throw new Error("Failed to delete link");
  }

  return true;
}

export async function fetchLinkStats(code) {
  const res = await fetch(`${API_BASE_URL}/api/links/${code}`);
  if (res.status === 404) {
    throw new Error("Code not found");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }
  return res.json();
}
