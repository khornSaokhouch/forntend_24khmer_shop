<template>
  <div>
    <h1>Login via Telegram OTP</h1>

    <div id="telegram-login"></div>

    <div v-if="otpSent">
      <input v-model="otp" placeholder="Enter OTP" />
      <button @click="verifyOtpCode">Verify OTP</button>
    </div>

    <p v-if="auth.error" style="color:red">{{ auth.error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const otp = ref("");
const otpSent = ref(false);
let telegramId = null; // will be set from Telegram login

onMounted(() => {
  // Inject Telegram login widget
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?7";
  script.setAttribute("data-telegram-login", "YOUR_BOT_USERNAME"); // replace with your bot username
  script.setAttribute("data-size", "large");
  script.setAttribute("data-userpic", "false");
  script.setAttribute("data-onauth", "onTelegramAuth(user)"); // callback
  script.async = true;
  document.getElementById("telegram-login").appendChild(script);

  // Define global callback
  window.onTelegramAuth = async (user) => {
    telegramId = user.id;
    await auth.sendOtp(telegramId); // request OTP automatically
    if (!auth.error) otpSent.value = true;
  };
});

const verifyOtpCode = async () => {
  await auth.verifyOtp(telegramId, otp.value);
  if (!auth.error) {
    alert(`Welcome ${auth.user.first_name}!`);
    // Redirect or fetch user data
  }
};
</script>
