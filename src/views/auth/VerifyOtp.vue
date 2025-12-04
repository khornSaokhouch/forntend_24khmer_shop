<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100">
      
      <!-- Icon -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-50/50">
          <ShieldCheck class="h-8 w-8 text-indigo-600" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900">Security Verification</h2>
        <p class="mt-2 text-sm text-slate-500">
          We sent a 6-digit code to Telegram ID: <br/>
          <span class="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{{ telegramId }}</span>
        </p>
      </div>

      <div class="mt-8 space-y-6">
        
        <!-- Error Banner -->
        <div v-if="auth.error" class="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 border border-red-100 animate-pulse">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ auth.error }}
        </div>

        <!-- Input Area -->
        <div>
          <label for="otp" class="sr-only">One Time Password</label>
          <input
            id="otp"
            v-model="otp"
            type="text"
            maxlength="6"
            placeholder="• • • • • •"
            class="block w-full text-center bg-slate-50 border border-slate-200 rounded-2xl py-4 text-3xl tracking-[1em] font-mono text-indigo-600 placeholder-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            @keyup.enter="verifyOtp"
            autofocus
          />
        </div>

        <!-- Verify Button -->
        <button 
          @click="verifyOtp" 
          :disabled="auth.loading || otp.length < 4"
          class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="auth.loading" class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Verifying...
          </span>
          <span v-else>Verify & Login</span>
        </button>

        <!-- Back / Resend -->
        <div class="flex justify-between items-center pt-4">
          <button @click="goBack" class="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            ← Wrong ID?
          </button>
          <button @click="resendCode" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Resend Code
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute(); // Use useRoute to get query params safely

const telegramId = ref(null);
const otp = ref("");

const verifyOtp = async () => {
  if(!otp.value) return;
  
  await auth.verifyOtp(telegramId.value, otp.value);

  // Success Check
  if (!auth.error) {
    // Optional: Add a success toast here if you have a toast library
    router.push("/"); // Redirect to Home
  }
};

const goBack = () => {
  router.push({ name: 'login', query: { telegram_id: telegramId.value } });
};

const resendCode = async () => {
  otp.value = "";
  await auth.sendOtp(telegramId.value);
  // Ideally show a "Code resent" temporary message here
};

onMounted(() => {
  // Try URL param first, then session storage
  const tidParam = route.query.telegram_id;
  
  if (tidParam) {
    telegramId.value = tidParam;
  } else {
    // Fallback if user refreshed page
    telegramId.value = sessionStorage.getItem("telegram_id");
  }

  if (!telegramId.value) {
    auth.error = "Session expired. Please restart the login process.";
  }
});
</script>