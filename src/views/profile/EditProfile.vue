<template>
  <div class="space-y-8">
    
    <!-- Header -->
    <div class="flex items-center justify-between pb-6 border-b border-slate-100">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Edit Profile</h1>
        <p class="text-slate-500 text-sm mt-1">Update your personal information.</p>
      </div>
      <!-- Back Button -->
      <router-link 
        to="/profile"
        class="text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <ArrowLeft class="w-4 h-4" />
        Cancel
      </router-link>
    </div>

    <!-- Edit Form -->
    <div class="max-w-2xl mx-auto space-y-8">

      <!-- Form Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- First Name -->
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
          <input 
            v-model="firstName" 
            type="text" 
            class="w-full text-base text-slate-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="John"
          />
        </div>

        <!-- Last Name -->
        <div class="space-y-1">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
          <input 
            v-model="lastName" 
            type="text" 
            class="w-full text-base text-slate-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="Doe"
          />
        </div>

        <!-- Username (Read Only / Disabled) -->
        <div class="space-y-1 md:col-span-2">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
          <div class="relative">
            <span class="absolute left-4 top-3.5 text-slate-400">@</span>
            <input 
              v-model="username" 
              type="text" 
              disabled
              class="w-full text-base text-slate-500 bg-slate-100 pl-8 pr-4 py-3 rounded-xl border border-slate-200 cursor-not-allowed select-none"
            />
            <div class="absolute right-4 top-3.5">
              <Lock class="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <p class="text-[10px] text-slate-400 px-1">Username is managed by Telegram and cannot be changed here.</p>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="pt-4 flex gap-4">
        <button 
          @click="saveProfile"
          :disabled="loading"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span>{{ loading ? 'Saving Changes...' : 'Save Changes' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/authStore";
import api from "@/services/api"; 
import { ArrowLeft, Loader2, Lock } from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();

// Form State
const firstName = ref("");
const lastName = ref("");
const username = ref("");
const loading = ref(false);

// Initialize Data
watch(() => authStore.user, (u) => {
  if (u) {
    firstName.value = u.first_name || "";
    lastName.value = u.last_name || "";
    username.value = u.username || "";
  }
}, { immediate: true });

// Save Action
const saveProfile = async () => {
  loading.value = true;
  try {
    const payload = {
      first_name: firstName.value,
      last_name: lastName.value
    };

    const res = await api.patch('/auth/update-profile', payload);

    if (res.data && res.data.data) {
      authStore.user = res.data.data;
      localStorage.setItem("user", JSON.stringify(res.data.data));
    } else {
      authStore.user.first_name = firstName.value;
      authStore.user.last_name = lastName.value;
    }
    
    router.push('/profile'); 
  } catch (error) {
    console.error("Update failed", error);
    alert("Failed to update profile. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>
