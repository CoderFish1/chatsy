// In dev, defaults to local backend. On Vercel, set VITE_API_URL to your Railway URL.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
