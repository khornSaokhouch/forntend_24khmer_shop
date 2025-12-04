<template>
  <div>
    <h1>Login via Telegram OTP</h1>

    <!-- Button to open Telegram login widget -->
    <button v-if="!widgetLoaded" @click="showTelegramLogin">
      Login with Telegram
    </button>

    <!-- Container for Telegram widget -->
    <div v-show="widgetLoaded" id="telegram-login"></div>

    <!-- OTP input -->
    <div v-if="otpSent">
      <input v-model="otp" placeholder="Enter OTP" />
      <button @click="verifyOtpCode">Verify OTP</button>
    </div>

    <p v-if="auth.error" style="color:red">{{ auth.error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const otp = ref("");
const otpSent = ref(false);
const widgetLoaded = ref(false);
let telegramId = null;

// Function to inject Telegram widget when button is clicked
const showTelegramLogin = () => {
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?7";
  script.setAttribute("data-telegram-login", "@CyberPioneerBot"); // replace with your bot username
  script.setAttribute("data-size", "large");
  script.setAttribute("data-userpic", "false");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.async = true;
  document.getElementById("telegram-login").appendChild(script);
  widgetLoaded.value = true;

  // Define global callback
  window.onTelegramAuth = async (user) => {
    telegramId = user.id;
    console.log("Telegram user:", user);

    // Send OTP after Telegram login
    await auth.sendOtp(telegramId);
    if (!auth.error) otpSent.value = true;
  };
};

// Verify OTP
const verifyOtpCode = async () => {
  if (!telegramId) return;
  await auth.verifyOtp(telegramId, otp.value);

  if (!auth.error) {
    alert(`Welcome ${auth.user.first_name}!`);
    // Optionally redirect or fetch user data
  }
};
</script>
