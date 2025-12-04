import { defineStore } from "pinia";
import api from "@/services/api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    telegramId: null,
  }),

  actions: {
    // Load token / user from localStorage (persistent)
    loadFromStorage() {
      console.log("[authStore] loadFromStorage called");

      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const telegramId = localStorage.getItem("telegram_id");

      if (token) this.token = token;
      if (telegramId) this.telegramId = telegramId;

      if (user) {
        this.user = JSON.parse(user);
        console.log("[authStore] Loaded from storage:", this.user);
      }
    },

    // Fetch fresh user from backend
    async loadUser() {
      if (!this.token) return;

      try {
        const res = await api.get("/auth/user");
        this.user = res.data.data;

        localStorage.setItem("user", JSON.stringify(this.user));

        console.log("[authStore] User refreshed:", this.user);
      } catch (err) {
        console.error("[authStore] loadUser error:", err);
      }
    },

    // Send OTP
    async sendOtp(telegramId) {
      console.log("[authStore] sendOtp called with Telegram ID:", telegramId);
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/send-otp", { telegram_id: telegramId });

        console.log("[authStore] OTP send response:", res.data);

        localStorage.setItem("telegram_id", telegramId);
        this.telegramId = telegramId;

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
      console.log("[authStore] verifyOtp called:", telegramId, otp);

      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/verify-otp", { telegram_id: telegramId, otp });

        this.user = res.data.data;
        this.token = res.data.token;
        this.telegramId = telegramId;

        // Save persistent
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        localStorage.setItem("telegram_id", telegramId);

        console.log("[authStore] OTP verified:", this.user);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error("[authStore] verifyOtp error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      console.log("[authStore] logout called");

      this.user = null;
      this.token = null;
      this.telegramId = null;

      // remove persistent data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("telegram_id");
    },
  },
});
