<template>
  <div class="login-container">
    <h1>Login via Telegram</h1>

    <!-- Error message if not in Telegram WebApp -->
    <div v-if="auth.error">
      <p style="color:red">{{ auth.error }}</p>
    </div>

    <!-- Telegram user detected -->
    <div v-else-if="telegramUser">
      <p>Hello, {{ telegramUser.first_name }}!</p>
      <p>Your Telegram ID: {{ telegramUser.id }}</p>

      <!-- Send OTP -->
      <div v-if="!otpSent">
        <button @click="requestOtp" :disabled="auth.loading">
          {{ auth.loading ? "Sending OTP..." : "Send OTP" }}
        </button>
      </div>

      <!-- Verify OTP -->
      <div v-if="otpSent && !auth.user">
        <input v-model="otp" placeholder="Enter OTP" />
        <button @click="verifyOtpCode" :disabled="auth.loading">
          {{ auth.loading ? "Verifying..." : "Verify OTP" }}
        </button>
      </div>

      <!-- Logged-in user info -->
      <div v-if="auth.user">
        <h2>Profile Info:</h2>
        <img :src="auth.user.image" alt="Profile Image" width="100" />
        <p><strong>Name:</strong> {{ auth.user.first_name }} {{ auth.user.last_name }}</p>
        <p><strong>Username:</strong> {{ auth.user.username }}</p>
        <p><strong>Telegram ID:</strong> {{ auth.user.telegram_id }}</p>
        <p><strong>Role:</strong> {{ auth.user.role }}</p>
        <button @click="logout">Logout</button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else>
      <p>Loading Telegram WebApp user...</p>
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

// Request OTP
const requestOtp = async () => {
  const telegramId = telegramUser.value?.id;
  if (!telegramId) return;
  console.log("Requesting OTP for Telegram ID:", telegramId);
  await auth.sendOtp(telegramId);
  if (!auth.error) otpSent.value = true;
};

// Verify OTP
const verifyOtpCode = async () => {
  const telegramId = telegramUser.value?.id;
  if (!telegramId || !otp.value) return;
  console.log("Verifying OTP for Telegram ID:", telegramId, "OTP:", otp.value);
  await auth.verifyOtp(telegramId, otp.value);
  if (!auth.error) {
    console.log("Verified user data:", auth.user);
    alert(`Welcome ${auth.user.first_name}!`);
  }
};

// Logout
const logout = () => {
  auth.logout();
  otpSent.value = false;
};

onMounted(async () => {
  console.log("Login.vue mounted");

  // Real Telegram WebApp
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    telegramUser.value = window.Telegram.WebApp.initDataUnsafe.user;
    console.log("Telegram WebApp user detected:", telegramUser.value);

    sessionStorage.setItem("telegram_id", telegramUser.value.id);

    // Load existing token/user
    auth.loadFromStorage();

    if (!auth.user) {
      console.log("Auto-requesting OTP for returning user...");
      await requestOtp();
    } else {
      otpSent.value = true; // already logged in
    }
  } else {
    auth.error = "This app must be opened inside Telegram WebApp.";
    console.warn("Telegram WebApp not detected.");
  }
});
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
  box-sizing: border-box;
}
button {
  padding: 10px 20px;
  cursor: pointer;
  margin: 5px 0;
}
img {
  border-radius: 50%;
  margin: 10px 0;
}
</style>
