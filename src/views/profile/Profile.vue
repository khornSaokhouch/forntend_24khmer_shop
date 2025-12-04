<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-8 max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">
        <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          My Profile
        </span>
      </h1>
      <p class="text-slate-600">
        View your account information below.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="!authStore.user" class="flex justify-center items-center py-20">
      <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
    </div>

    <!-- Profile Information -->
    <div v-else class="max-w-7xl mx-auto space-y-8">
      <!-- Profile Card -->
      <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center md:space-x-8">
        <!-- Profile Image -->
        <div class="relative mb-6 md:mb-0">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-md">
            <div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img 
                v-if="authStore.user.profile_image" 
                :src="`${API_URL}/${authStore.user.profile_image}`" 
                class="w-full h-full object-cover" 
                alt="Profile Image"
              />
              <span v-else class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {{ authStore.user.name.charAt(0) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Info Fields -->
        <div class="flex-1 w-full space-y-4">
          <div>
            <p class="text-slate-500 text-sm font-medium">Full Name</p>
            <p class="text-slate-800 font-semibold text-lg">{{ authStore.user.name }}</p>
          </div>

          <div>
            <p class="text-slate-500 text-sm font-medium">Email</p>
            <p class="text-slate-800 font-semibold text-lg">{{ authStore.user.email }}</p>
          </div>

          <div>
            <p class="text-slate-500 text-sm font-medium">Role</p>
            <p class="text-slate-800 font-semibold text-lg capitalize">{{ authStore.user.role }}</p>
          </div>
        </div>
      </div>

      <!-- Account Details Card -->
      <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-8 shadow-lg">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">Account Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-slate-50/50 rounded-xl border border-slate-200">
            <p class="text-slate-500 text-sm font-medium mb-2">User ID</p>
            <p class="text-slate-800 font-semibold text-lg">{{ authStore.user.id }}</p>
          </div>
          
          <div class="p-6 bg-slate-50/50 rounded-xl border border-slate-200">
            <p class="text-slate-500 text-sm font-medium mb-2">Created At</p>
            <p class="text-slate-800 font-semibold text-base">{{ formatDate(authStore.user.created_at) }}</p>
          </div>

          <div class="p-6 bg-slate-50/50 rounded-xl border border-slate-200">
            <p class="text-slate-500 text-sm font-medium mb-2">Updated At</p>
            <p class="text-slate-800 font-semibold text-base">{{ formatDate(authStore.user.updated_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Full Image -->
    <transition name="fade-scale">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="relative bg-white rounded-xl overflow-hidden max-w-lg w-full shadow-lg">
          <button @click="closeModal" class="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition">
            ✕
          </button>
          <img :src="`${API_URL}/${authStore.user.profile_image}`" alt="Profile Full Image" class="w-full h-auto object-cover"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../store/authStore";

const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;

const showModal = ref(false);
function openModal() {
  if (authStore.user?.profile_image) showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

// Format ISO date strings
function formatDate(isoString) {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString();
}
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
