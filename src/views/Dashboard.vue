<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
      <p class="text-slate-500">A quick summary of your application's data.</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
    </div>

    <!-- Stat Cards Grid -->
    <!-- MODIFIED: Changed grid to lg:grid-cols-2 since there are only two cards now -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      
      <!-- Total Users Card -->
      <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg flex items-center space-x-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users class="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500">Total Users</p>
          <p class="text-4xl font-bold text-slate-800">{{ formattedTotalUsers }}</p>
        </div>
      </div>
      
      <!-- Total Products Card -->
      <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg flex items-center space-x-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div class="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Package class="w-8 h-8 text-cyan-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500">Total Products</p>
          <p class="text-4xl font-bold text-slate-800">{{ formattedTotalProducts }}</p>
        </div>
      </div>

      <!-- REMOVED: The Total Revenue Card has been deleted from the template -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// MODIFIED: Corrected the user store import path (assuming it's named useUserStore)
import { useUserStore } from '@/store/userStore';
import { useProductStore } from '@/store/useProductStore';
// REMOVED: import for useOrderStore has been deleted
// MODIFIED: Removed DollarSign icon as it's no longer used
import { Users, Package } from 'lucide-vue-next';

// Initialize stores
const userStore = useUserStore();
const productStore = useProductStore();
// REMOVED: orderStore initialization has been deleted

// Reactive state
const loading = ref(true);
const totalUsers = ref(0);
const totalProducts = ref(0);
// REMOVED: totalRevenue state has been deleted

onMounted(async () => {
  try {
    // MODIFIED: Removed orderStore.fetchOrders() from the Promise.all array
    await Promise.all([
      userStore.fetchUsers(),
      productStore.fetchProducts(),
    ]);
    
    // Calculate the totals after fetching
    totalUsers.value = userStore.users.length;
    totalProducts.value = productStore.products.length;
    
    // REMOVED: The revenue calculation has been deleted
    
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  } finally {
    loading.value = false;
  }
});

// Computed properties to format the numbers for display
const formattedTotalUsers = computed(() => {
  return totalUsers.value.toLocaleString();
});

const formattedTotalProducts = computed(() => {
  return totalProducts.value.toLocaleString();
});

// REMOVED: The formattedTotalRevenue computed property has been deleted
</script>