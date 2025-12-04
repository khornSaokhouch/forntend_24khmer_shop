<template>
  <div class="login-container">
    <h1>Login via Telegram OTP</h1>

    <!-- Telegram login widget -->
    <div id="telegram-login" class="telegram-widget"></div>

    <!-- OTP input -->
    <div v-if="otpSent" class="otp-container">
      <input v-model="otp" placeholder="Enter OTP" class="otp-input" />
      <button @click="verifyOtpCode" class="otp-button">Verify OTP</button>
    </div>

    <!-- Error message -->
    <p v-if="auth.error" class="error-message">{{ auth.error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const otp = ref("");
const otpSent = ref(false);
let telegramId = null;

onMounted(() => {
  // Inject Telegram login widget
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?7";
  script.setAttribute("data-telegram-login", "CyberPioneerBot"); // replace with your bot username
  script.setAttribute("data-size", "large");
  script.setAttribute("data-userpic", "false");
  script.setAttribute("data-onauth", "onTelegramAuth(user)"); // global callback
  script.async = true;
  document.getElementById("telegram-login").appendChild(script);

  // Telegram login callback
  window.onTelegramAuth = async (user) => {
    telegramId = user.id.toString();
    console.log("Telegram user:", user);

    // Send OTP automatically
    await auth.sendOtp(telegramId);
    if (!auth.error) otpSent.value = true;
  };
});

const verifyOtpCode = async () => {
  if (!telegramId) return;

  await auth.verifyOtp(telegramId, otp.value);

  if (!auth.error) {
    alert(`Welcome ${auth.user.first_name}!`);
    // Optionally: redirect user or fetch updated user data
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.otp-container {
  margin-top: 1rem;
}

.otp-input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 60%;
  margin-right: 0.5rem;
}

.otp-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
