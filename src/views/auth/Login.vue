<template>
  <div>
    <h1>Login via Telegram OTP</h1>

    <!-- Telegram login widget -->
    <div id="telegram-login"></div>

    <div v-if="otpSent">
      <input v-model="otp" placeholder="Enter OTP" />
      <button @click="verifyOtpCode">Verify OTP</button>
    </div>
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
  // Inject Telegram widget
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?7";
  script.setAttribute("data-telegram-login", "CyberPioneerBot"); 
  script.setAttribute("data-size", "large");
  script.setAttribute("data-userpic", "false");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.async = true;
  document.getElementById("telegram-login").appendChild(script);

  // Telegram login callback
  window.onTelegramAuth = async (user) => {
    telegramId = user.id;
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
  }
};
</script>
