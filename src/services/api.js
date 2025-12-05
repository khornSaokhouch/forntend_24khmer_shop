import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,  // <- USE VITE_BACKEND_URL
  timeout: 5000,
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const authStore = useAuthStore();
      if (authStore?.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
    } catch (err) {
      console.warn("Auth store not ready yet", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
