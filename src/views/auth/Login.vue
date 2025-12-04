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

      <div v-if="auth.user">
        <h2>Profile Info:</h2>
        <img :src="auth.user.image" alt="Profile Image" width="100" />
        <p><strong>Name:</strong> {{ auth.user.first_name }} {{ auth.user.last_name }}</p>
        <p><strong>Username:</strong> {{ auth.user.username }}</p>
        <p><strong>Telegram ID:</strong> {{ auth.user.telegram_id }}</p>
        <p><strong>Role:</strong> {{ auth.user.role }}</p>
      </div>
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
    console.log("Telegram user info:", telegramUser.value);
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
    console.log("Verified user data:", auth.user); // Log full user info
    alert(`Welcome ${auth.user.first_name}!`);
    // You can redirect to dashboard here
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
img {
  border-radius: 50%;
  margin: 10px 0;
}
</style>
