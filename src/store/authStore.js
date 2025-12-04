import { defineStore } from "pinia";
import api from "../services/api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  actions: {
    // Request OTP
    async sendOtp(telegram_id) {
      this.loading = true;
      this.error = null;
      try {
        await api.post("/auth/send-otp", { telegram_id });
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to send OTP";
      } finally {
        this.loading = false;
      }
    },

    // Verify OTP and login
    async verifyOtp(telegram_id, otp) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/verify-otp", { telegram_id, otp });
        this.token = res.data.token;
        this.user = res.data.data;

        // Store in sessionStorage
        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("user", JSON.stringify(this.user));
      } catch (err) {
        this.error = err.response?.data?.message || "OTP verification failed";
      } finally {
        this.loading = false;
      }
    },

    // Load token/user from sessionStorage
    loadFromStorage() {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },

    // Logout
    logout() {
      this.token = null;
      this.user = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },

    // Fetch latest user info
    async fetchUser() {
      if (!this.user?.id) return;
      this.loading = true;
      try {
        const res = await api.get(`/users/${this.user.id}`);
        this.user = res.data.data;
        sessionStorage.setItem("user", JSON.stringify(this.user));
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch user";
      } finally {
        this.loading = false;
      }
    },

    // Update local user state
    updateLocalUser(updatedData) {
      this.user = { ...this.user, ...updatedData };
      sessionStorage.setItem("user", JSON.stringify(this.user));
    },
  },
});
