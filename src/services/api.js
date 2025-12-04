import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.backend_url || "http://localhost:3000/api",
  timeout: 5000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore?.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export default api;
