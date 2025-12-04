<template>
  <div class="container">
    <h1>Verify OTP</h1>

    <div v-if="auth.error" class="error">{{ auth.error }}</div>

    <p>We sent an OTP to Telegram ID:</p>
    <p class="tid">{{ telegramId }}</p>

    <input
      v-model="otp"
      placeholder="Enter OTP"
      class="otp-input"
      maxlength="6"
    />

    <button @click="verifyOtp" :disabled="auth.loading">
      {{ auth.loading ? "Verifying..." : "Verify OTP" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const router = useRouter();

const telegramId = ref(null);
const otp = ref("");

const verifyOtp = async () => {
  await auth.verifyOtp(telegramId.value, otp.value);

  if (!auth.error) {
    alert("Login successful!");
    router.push("/");
  }
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  telegramId.value = params.get("telegram_id");

  if (!telegramId.value) {
    auth.error = "Missing Telegram ID";
  }
});
</script>

<style scoped>
.container {
  max-width: 380px;
  margin: 80px auto;
  padding: 20px;
  text-align: center;
}
.otp-input {
  width: 100%;
  padding: 12px;
  font-size: 20px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
  letter-spacing: 6px;
}
button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
}
.error {
  color: red;
  margin-bottom: 15px;
}
.tid {
  font-weight: bold;
}
</style>
