<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import api from "@/services/api.js";
import { useAuthStore } from "@/store/authStore";

const toast = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const payments = ref([]);
const filterStatus = ref("all");

// Fetch payments
const fetchPayments = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/payments?user_id=${authStore.user.id}`);
    payments.value = res.data;
  } catch (err) {
    toast.error(err.response?.data?.detail || "Failed to fetch payments", { position: "top-right" });
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString();
};

// Filtered payments based on status
const filteredPayments = computed(() => {
  if (filterStatus.value === "all") return payments.value;
  return payments.value.filter(payment => payment.status === filterStatus.value);
});

onMounted(fetchPayments);
</script>

<template>
  <div class="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <h1 class="text-3xl font-bold text-slate-900 mb-6">My Payments</h1>

    <!-- Filter -->
    <div class="mb-4 flex items-center gap-4">
      <label class="text-slate-700 font-medium">Filter by Status:</label>
      <select v-model="filterStatus" class="p-2 border border-slate-300 rounded-lg">
        <option value="all">All</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredPayments.length === 0" class="text-center text-slate-500 py-10">
      No payments found.
    </div>

    <!-- Payments table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
        <thead>
          <tr class="bg-blue-100/50 text-slate-700">
            <th class="px-6 py-3 text-left font-medium">Payment ID</th>
            <th class="px-6 py-3 text-left font-medium">Order ID</th>
            <th class="px-6 py-3 text-left font-medium">Amount</th>
            <th class="px-6 py-3 text-left font-medium">Status</th>
            <th class="px-6 py-3 text-left font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in filteredPayments" :key="payment.id" class="border-t border-slate-200 hover:bg-slate-50 transition">
            <td class="px-6 py-4 text-slate-800">{{ payment.id }}</td>
            <td class="px-6 py-4 text-slate-800">{{ payment.order_id }}</td>
            <td class="px-6 py-4 text-slate-800">${{ payment.amount.toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span
                :class="{
                  'text-green-600': payment.status === 'paid',
                  'text-yellow-600': payment.status === 'pending',
                  'text-red-600': payment.status === 'failed',
                  'font-semibold': true,
                  'capitalize': true
                }"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-500">{{ formatDate(payment.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
tr:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}
</style>
