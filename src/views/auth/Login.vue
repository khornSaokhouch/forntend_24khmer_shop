<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login via Telegram OTP</h1>

      <!-- Telegram login button -->
      <div v-if="!widgetLoaded" class="flex justify-center">
        <button
          @click="showTelegramLogin"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-200"
        >
          Login with Telegram
        </button>
      </div>

      <!-- Telegram widget container -->
      <div v-show="widgetLoaded" id="telegram-login" class="my-4 flex justify-center"></div>

      <!-- OTP input -->
      <div v-if="otpSent" class="mt-4">
        <input
          v-model="otp"
          type="text"
          placeholder="Enter OTP"
          class="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="verifyOtpCode"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-200"
        >
          Verify OTP
        </button>
      </div>

      <!-- Error message -->
      <p v-if="auth.error" class="mt-4 text-red-500 text-center">{{ auth.error }}</p>
    </div>
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
  script.setAttribute("data-telegram-login", "CyberPioneerBot"); // replace with your bot username
  script.setAttribute("data-size", "large");
  script.setAttribute("data-userpic", "false");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.async = true;
  document.getElementById("telegram-login").appendChild(script);
  widgetLoaded.value = true;

  // Global callback
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
