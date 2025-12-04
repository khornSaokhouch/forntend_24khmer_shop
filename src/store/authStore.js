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
    // Load token/user from session storage
    loadFromStorage() {
      console.log("[authStore] loadFromStorage called");
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");
      const telegramId = sessionStorage.getItem("telegram_id");
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        this.telegramId = telegramId;
        console.log("[authStore] Loaded from session:", this.user, this.token);
      }
    },

    // Send OTP to Telegram
    async sendOtp(telegramId) {
      console.log("[authStore] sendOtp called with Telegram ID:", telegramId);
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/send-otp", { telegram_id: telegramId });
        console.log("[authStore] OTP send response:", res.data);
        sessionStorage.setItem("telegram_id", telegramId);
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
      console.log("[authStore] verifyOtp called with Telegram ID:", telegramId, "OTP:", otp);
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/verify-otp", { telegram_id: telegramId, otp });
        this.user = res.data.data;
        this.token = res.data.token;
        this.telegramId = telegramId;

        sessionStorage.setItem("user", JSON.stringify(this.user));
        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("telegram_id", telegramId);

        console.log("[authStore] OTP verified. User stored in session:", this.user);
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
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("telegram_id");
    },
  },
});
