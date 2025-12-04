<template>
  <div class="login-container">
    <h1>Login via Telegram OTP</h1>

    <div v-if="telegramUser">
      <p>Hello, {{ telegramUser.first_name }}!</p>
      <p>Your Telegram ID: {{ telegramUser.id }}</p>

      <!-- Send OTP button -->
      <button @click="requestOtp" :disabled="otpSent">
        {{ otpSent ? "OTP Sent" : "Send OTP" }}
      </button>
    </div>

    <div v-if="otpSent">
      <input v-model="otp" placeholder="Enter OTP" />
      <button @click="verifyOtpCode">Verify OTP</button>
    </div>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const telegramUser = ref(null);
const otp = ref("");
const otpSent = ref(false);
const error = ref(null);

onMounted(() => {
  // Check if inside Telegram Web App
  if (window.Telegram?.WebApp) {
    telegramUser.value = window.Telegram.WebApp.initDataUnsafe.user;
    console.log("Telegram user:", telegramUser.value);
  } else {
    error.value = "Please open this page inside Telegram using the Bot.";
  }
});

// Request OTP via bot
const requestOtp = async () => {
  if (!telegramUser.value) return;
  try {
    await auth.sendOtp(telegramUser.value.id);
    otpSent.value = true;
  } catch (err) {
    error.value = err.message;
  }
};

// Verify OTP
const verifyOtpCode = async () => {
  if (!telegramUser.value) return;
  await auth.verifyOtp(telegramUser.value.id, otp.value);
  if (!auth.error) {
    alert(`Welcome ${auth.user.first_name}!`);
  }
};
</script>
