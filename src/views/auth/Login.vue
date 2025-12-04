<template>
  <div class="login-container">
    <h1>Welcome to the Bot Web App</h1>

    <div v-if="telegramUser">
      <p>Hello, {{ telegramUser.first_name }}!</p>
      <p>Your Telegram ID: {{ telegramUser.id }}</p>

      <!-- Request OTP -->
      <button @click="requestOtp">Send OTP</button>
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
  if (window.Telegram?.WebApp) {
    // Get Telegram user automatically
    telegramUser.value = window.Telegram.WebApp.initDataUnsafe.user;
    console.log("Telegram User:", telegramUser.value);
  } else {
    error.value = "This app must be opened inside Telegram.";
  }
});

const requestOtp = async () => {
  if (!telegramUser.value) return;
  try {
    await auth.sendOtp(telegramUser.value.id);
    otpSent.value = true;
  } catch (err) {
    error.value = err.message;
  }
};

const verifyOtpCode = async () => {
  if (!telegramUser.value) return;
  await auth.verifyOtp(telegramUser.value.id, otp.value);
  if (!auth.error) {
    alert(`Welcome ${auth.user.first_name}!`);
  }
};
</script>
