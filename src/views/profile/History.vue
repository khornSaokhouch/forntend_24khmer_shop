<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import api from "@/services/api.js";
import { useAuthStore } from "@/store/authStore";

const toast = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const history = ref([]);

// Fetch user's history from API
const fetchHistory = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/orders/history?user_id=${authStore.user.id}`);
    history.value = res.data;
  } catch (err) {
    toast.error(err.response?.data?.detail || "Failed to fetch history", { position: "top-right" });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchHistory);

// Format date for display
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString();
};
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <h1 class="text-3xl font-bold text-slate-900 mb-6">Order History</h1>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
    </div>

    <div v-else>
      <div v-if="history.length === 0" class="text-center text-slate-500 py-10">
        No history found.
      </div>

      <div v-else class="grid gap-4">
        <div v-for="item in history" :key="item.id" class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center">
          <div class="flex-1">
            <p class="font-semibold text-lg text-slate-900">{{ item.product_name }}</p>
            <p class="text-sm text-slate-600">Order ID: {{ item.id }}</p>
            <p class="text-sm text-slate-600">Amount: ${{ item.amount.toFixed(2) }}</p>
          </div>
          <div class="flex flex-col items-end">
            <p :class="{'text-green-600': item.status === 'completed', 'text-yellow-600': item.status === 'pending', 'text-red-600': item.status === 'canceled'}" class="font-semibold capitalize">
              {{ item.status }}
            </p>
            <p class="text-sm text-slate-500">{{ formatDate(item.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add a hover effect */
div[role="item"]:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease-in-out;
}
</style>
