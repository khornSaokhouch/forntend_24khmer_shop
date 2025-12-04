<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100">
      
      <!-- Header / Logo -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-6">
          <Send class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
        <p class="mt-2 text-sm text-slate-500">
          Login via Telegram to access your account.
        </p>
      </div>

      <!-- Main Content -->
      <div v-if="telegramId" class="mt-8 space-y-6">
        
        <!-- User Info Card -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center space-x-4">
          <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
            {{ telegramId.toString().slice(0, 1) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 truncate">
              Telegram User
            </p>
            <p class="text-sm text-slate-500 truncate font-mono">
              ID: {{ telegramId }}
            </p>
          </div>
          <div class="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <!-- Error Message -->
        <div v-if="auth.error" class="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle class="w-4 h-4" />
          {{ auth.error }}
        </div>

        <!-- Action Button -->
        <button 
          @click="requestOtp" 
          :disabled="auth.loading"
          class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="auth.loading" class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Sending Code...
          </span>
          <span v-else class="flex items-center gap-2">
            Send Verification Code
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

      </div>

      <!-- No ID Found State -->
      <div v-else class="mt-8 text-center bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <AlertTriangle class="h-10 w-10 text-orange-500 mx-auto mb-3" />
        <h3 class="text-lg font-medium text-orange-800">Connection Failed</h3>
        <p class="mt-2 text-sm text-orange-600">
          We couldn't detect your Telegram ID. Please make sure you are opening this app from the Telegram Bot.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { Send, ArrowRight, Loader2, AlertCircle, AlertTriangle } from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const telegramId = ref(null);

const requestOtp = async () => {
  // Clear previous errors
  auth.error = null;
  
  await auth.sendOtp(telegramId.value);
  
  // If no error, AUTO NAVIGATE to verify page
  if (!auth.error) {
    router.push({ 
      name: 'verify-otp', 
      query: { telegram_id: telegramId.value } 
    });
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const tidParam = params.get("telegram_id");
  
  if (tidParam) {
    telegramId.value = tidParam;
    // Store in session in case page refresh happens
    sessionStorage.setItem("telegram_id", tidParam);
  } else {
    // Try to recover from session
    const stored = sessionStorage.getItem("telegram_id");
    if (stored) telegramId.value = stored;
  }
});
</script>