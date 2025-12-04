<template>
  <div class="container">
    <h1>Login</h1>

    <div v-if="auth.error" class="error">{{ auth.error }}</div>

    <div v-if="telegramId">
      <p>Telegram ID detected:</p>
      <p class="tid">{{ telegramId }}</p>

      <button @click="requestOtp" :disabled="auth.loading">
        {{ auth.loading ? "Sending..." : "Send OTP" }}
      </button>

      <router-link
        v-if="otpSent"
        :to="{ name: 'verify-otp', query: { telegram_id: telegramId }}"
        class="verify-link"
      >
        Go to OTP Verification →
      </router-link>
    </div>

    <div v-else class="error">
      Telegram ID not found. Please open from Telegram bot.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const telegramId = ref(null);
const otpSent = ref(false);

const requestOtp = async () => {
  await auth.sendOtp(telegramId.value);
  if (!auth.error) {
    otpSent.value = true;
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  telegramId.value = params.get("telegram_id");

  if (!telegramId.value) {
    auth.error = "Telegram ID not found.";
    return;
  }

  sessionStorage.setItem("telegram_id", telegramId.value);
});
</script>

<style scoped>
.container {
  max-width: 380px;
  margin: 80px auto;
  padding: 20px;
  text-align: center;
}
button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  font-size: 16px;
  cursor: pointer;
}
.error {
  color: red;
  margin-bottom: 15px;
}
.tid {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.verify-link {
  display: block;
  margin-top: 20px;
  font-size: 16px;
  color: blue;
}
</style>
