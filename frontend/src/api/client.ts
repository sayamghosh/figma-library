import axios from "axios";

function normalizeApiUrl(value?: string): string {
  const fallback = "http://localhost:5000/api";
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const withProtocol = hasProtocol ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

const baseURL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
