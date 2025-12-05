import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
  timeout: 5000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  try {
    // Get the store inside the interceptor
    const authStore = useAuthStore();
    if (authStore?.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
  } catch (err) {
    console.warn("Auth store not ready yet", err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
