// src/store/authStore.js
import { defineStore } from "pinia";
import api from "@/services/api.js";

export const useAuthStore = defineStore("auth", {
  id: "auth", // optional, but good practice

  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    telegramId: null,
  }),

  actions: {
    // Fetch fresh user from backend
    async loadUser() {
      if (!this.token) return; // token is required

      this.loading = true;
      this.error = null;

      try {
        const res = await api.get("/auth/user", {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        this.user = res.data.data;
        console.log("[authStore] User refreshed:", this.user);
      } catch (err) {
        console.error("[authStore] loadUser error:", err.response?.data || err.message);
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    // Send OTP to Telegram ID
    async sendOtp(telegramId) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/send-otp", { telegram_id: telegramId });

        this.telegramId = telegramId;
        console.log("[authStore] OTP sent:", res.data);

        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error("[authStore] sendOtp error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    // Verify OTP and store JWT + user
    async verifyOtp(telegramId, otp) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/verify-otp", { telegram_id: telegramId, otp });

        this.user = res.data.data;
        this.token = res.data.token;
        this.telegramId = telegramId;

        console.log("[authStore] OTP verified:", this.user);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error("[authStore] verifyOtp error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    // Logout user
    async logout() {
      if (this.token) {
        try {
          await api.post("/auth/logout", {}, {
            headers: { Authorization: `Bearer ${this.token}` },
          });
          console.log("[authStore] Backend logout successful");
        } catch (err) {
          console.error("[authStore] Backend logout error:", err.response?.data || err.message);
        }
      }

      // Clear local state
      this.user = null;
      this.token = null;
      this.telegramId = null;
      this.error = null;
    },
  },

  persist: {
    key: "auth",
    storage: localStorage,
    paths: ["token", "user", "telegramId"], // only persist these
  },
});
