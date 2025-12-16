<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
    <!-- Main Card -->
    <div class="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 relative">
      
      <!-- Decorative Background Blur (Positioned absolutely so it doesn't affect flow) -->
      <div class="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div class="absolute -bottom-10 -left-10 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <!-- Header / Icon -->
      <div class="text-center relative z-10">
        <div class="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 ring-1 ring-indigo-100 shadow-sm transform rotate-3 transition-transform hover:rotate-6">
          <ShieldCheck class="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Security Verification</h2>
        <p class="mt-2 text-xs sm:text-sm text-slate-500">
          Enter the 6-digit code sent to your Telegram.
        </p>
        
        <!-- ID Badge -->
        <div class="mt-3 inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <p class="text-[10px] sm:text-xs text-slate-600 font-mono font-medium">
             {{ telegramId || 'Unknown ID' }}
          </p>
        </div>
      </div>

      <!-- Form Content -->
      <div class="mt-6 sm:mt-8 space-y-6 relative z-10">
        
        <!-- Error Banner -->
        <transition name="fade">
          <div v-if="auth.error" class="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-xl flex items-start gap-2 border border-red-100 shadow-sm">
            <AlertCircle class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
            <span class="break-words leading-tight">{{ auth.error }}</span>
          </div>
        </transition>

        <!-- 6-Box OTP Input - Responsive Grid Logic -->
        <div class="flex justify-center gap-1 sm:gap-3">
          <input
            v-for="(digit, index) in digits"
            :key="index"
            ref="inputRefs"
            type="text"
            inputmode="numeric"
            pattern="\d*"
            maxlength="1"
            v-model="digits[index]"
            @keydown="handleKeydown($event, index)"
            @input="handleInput($event, index)"
            @paste="handlePaste"
            @focus="handleFocus($event)"
            class="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none transition-all duration-200 caret-indigo-500 shadow-sm"
            :class="[
              digits[index] 
                ? 'border-indigo-500 text-indigo-600 bg-white ring-2 ring-indigo-100' 
                : 'focus:border-indigo-400 focus:bg-white'
            ]"
          />
        </div>

        <!-- Timer & Resend -->
        <div class="text-center h-6"> <!-- Fixed height prevents jump when switching text -->
          <div v-if="timeLeft > 0" class="text-xs sm:text-sm text-slate-500 font-medium flex justify-center items-center gap-2">
            <Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            Resend in <span class="text-indigo-600 font-bold tabular-nums">{{ formattedTime }}</span>
          </div>
          
          <button 
            v-else 
            @click="handleResend"
            :disabled="auth.loading"
            class="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
          >
            <RefreshCw class="w-3.5 h-3.5 sm:w-4 sm:h-4" :class="{ 'animate-spin': auth.loading }" />
            Resend Code
          </button>
        </div>

        <!-- Verify Button -->
        <button 
          @click="submitVerification" 
          :disabled="auth.loading || !isComplete"
          class="w-full flex justify-center items-center py-3.5 sm:py-4 px-4 border border-transparent text-sm sm:text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <span v-if="auth.loading" class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Verifying...
          </span>
          <span v-else>Verify & Login</span>
        </button>

        <!-- Change ID Link -->
        <div class="text-center">
           <button @click="goBack" class="text-xs sm:text-sm text-slate-400 hover:text-slate-600 transition-colors py-2">
            Changed account? Enter new ID
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, Loader2, AlertCircle, Clock, RefreshCw } from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// State
const telegramId = ref(null);
const digits = ref(["", "", "", "", "", ""]);
const inputRefs = ref([]); 
const timeLeft = ref(60); 
let timerInterval = null;

// Computed
const isComplete = computed(() => digits.value.every(d => d !== ""));
const otpString = computed(() => digits.value.join(""));
const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
});

// Timer Logic
const startTimer = () => {
  timeLeft.value = 60;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
    else clearInterval(timerInterval);
  }, 1000);
};

// Input Logic
const handleInput = (event, index) => {
  const value = event.target.value;
  if (!/^\d*$/.test(value)) {
    digits.value[index] = "";
    return;
  }
  digits.value[index] = value.slice(-1); 
  if (digits.value[index] && index < 5) {
    nextTick(() => inputRefs.value[index + 1].focus());
  }
  if (isComplete.value) submitVerification();
};

const handleKeydown = (event, index) => {
  if (event.key === "Backspace" && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1].focus();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData("text").trim();
  if (/^\d{6}$/.test(pastedData)) {
    const chars = pastedData.split("");
    chars.forEach((char, i) => { if (i < 6) digits.value[i] = char; });
    nextTick(() => {
      inputRefs.value[5].focus();
      submitVerification();
    });
  }
};

const handleFocus = (event) => event.target.select();

// Actions
const submitVerification = async () => {
  if (!isComplete.value || auth.loading) return;
  await auth.verifyOtp(telegramId.value, otpString.value);
  if (!auth.error) {
    clearInterval(timerInterval);
    const role = auth.user?.role;
    router.push(role === "admin" ? "/dashboard" : "/");
  } else {
    digits.value = ["", "", "", "", "", ""];
    inputRefs.value[0].focus();
  }
};

const handleResend = async () => {
  if (timeLeft.value > 0) return;
  digits.value = ["", "", "", "", "", ""];
  await auth.sendOtp(telegramId.value);
  if (!auth.error) {
    startTimer();
    inputRefs.value[0].focus();
  }
};

const goBack = () => {
  router.push({ name: 'login', query: { telegram_id: telegramId.value } });
};

// Lifecycle
onMounted(() => {
  const tidParam = route.query.telegram_id;
  telegramId.value = tidParam || sessionStorage.getItem("telegram_id");

  if (!telegramId.value) {
    auth.error = "Session expired.";
    setTimeout(() => router.push('/login'), 2000);
    return;
  }
  startTimer();
  nextTick(() => { if(inputRefs.value[0]) inputRefs.value[0].focus(); });
});

onUnmounted(() => clearInterval(timerInterval));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>