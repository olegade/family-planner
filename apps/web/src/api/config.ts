const origin = window.location.origin;

// If VITE_API_URL is set, use it. Otherwise, swap 3000 -> 3001.
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ??
  origin.replace(":3000", ":3001");