import { defineStore } from "pinia";
import api from "@/services/api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  actions: {
    async sendOtp(telegramId) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/send-otp", { telegram_id: telegramId });
        this.loading = false;
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        this.loading = false;
      }
    },

    async verifyOtp(telegramId, otp) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/verify-otp", { telegram_id: telegramId, otp });
        this.user = res.data.data;
        this.token = res.data.token;

        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("user", JSON.stringify(this.user));
        console.log("User stored in session:", this.user);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    loadFromStorage() {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});
