<template>
  <div class="login-container">
    <h1>Login via Telegram</h1>

    <div v-if="!telegramUser">
      <p>Please open this page inside Telegram Web App.</p>
    </div>

    <div v-else>
      <p>Hello, {{ telegramUser.first_name }}!</p>
      <p>Your Telegram ID: {{ telegramUser.id }}</p>

      <div v-if="!otpSent">
        <button @click="requestOtp" :disabled="auth.loading">
          {{ auth.loading ? "Sending OTP..." : "Send OTP" }}
        </button>
      </div>

      <div v-if="otpSent">
        <input v-model="otp" placeholder="Enter OTP" />
        <button @click="verifyOtpCode" :disabled="auth.loading">
          {{ auth.loading ? "Verifying..." : "Verify OTP" }}
        </button>
      </div>

      <p v-if="auth.error" style="color:red">{{ auth.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const telegramUser = ref(null);
const otp = ref("");
const otpSent = ref(false);

onMounted(() => {
  if (window.Telegram?.WebApp) {
    // Get Telegram user automatically
    telegramUser.value = window.Telegram.WebApp.initDataUnsafe.user;
  } else {
    auth.error = "This app must be opened inside Telegram.";
  }
});

const requestOtp = async () => {
  if (!telegramUser.value) return;
  await auth.sendOtp(telegramUser.value.id);
  if (!auth.error) otpSent.value = true;
};

const verifyOtpCode = async () => {
  if (!telegramUser.value) return;
  await auth.verifyOtp(telegramUser.value.id, otp.value);
  if (!auth.error) {
    alert(`Welcome ${auth.user.first_name}!`);
    // Redirect to dashboard or main page
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
input {
  padding: 8px;
  margin: 10px 0;
  width: 100%;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>
