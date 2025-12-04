<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import api from "@/services/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

// Form fields
const email = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);

// Form submit handler
const resetPassword = async () => {
  if (!email.value.trim() || !newPassword.value.trim() || !confirmPassword.value.trim()) {
    toast.error("All fields are required", { position: "top-right" });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error("Passwords do not match", { position: "top-right" });
    return;
  }

  loading.value = true;
  try {
    const res = await api.post("/auth/reset-password", {
      email: email.value,
      new_password: newPassword.value,
    });

    toast.success("Password reset successfully!", { position: "top-right" });
    router.push("/login");
  } catch (err) {
    toast.error(err.response?.data?.detail || "Failed to reset password", { position: "top-right" });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-8 shadow-lg">
      <h1 class="text-2xl font-bold text-center text-slate-900 mb-6">Reset Password</h1>

      <form @submit.prevent="resetPassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="New password"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>

      <p class="text-sm text-center text-slate-500 mt-4">
        Remember your password? 
        <router-link to="/login" class="text-blue-600 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add smooth focus transition */
input:focus {
  transition: all 0.2s ease-in-out;
}
</style>
