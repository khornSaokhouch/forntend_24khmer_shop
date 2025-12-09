<template>
  <div class="space-y-8">
    
    <!-- Header -->
    <div class="flex items-center justify-between pb-6 border-b border-slate-100">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Personal Information</h1>
        <p class="text-slate-500 text-sm mt-1">Manage your personal details and account settings.</p>
      </div>
    <router-link 
  to="/profile/edit-profile" 
  class="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
>
  <Edit class="w-4 h-4" /> <!-- Icon -->
  Edit
</router-link>


    </div>

    <!-- Data Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
     <!-- Full Name -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
        <div class="text-base font-medium text-slate-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 capitalize">
          {{ user?.first_name }} {{ user?.last_name || '' }}
        </div>
      </div>

      <!-- Username -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telegram Username</label>
        <div class="flex items-center gap-2 text-base font-medium text-slate-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
          <span class="text-slate-400">@</span>
          {{ user?.username || 'Not set' }}
        </div>
      </div>

      <!-- Telegram ID -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telegram ID</label>
        <div class="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
          <span class="text-base font-medium text-slate-900 font-mono">{{ user?.telegram_id }}</span>
          <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium">Verified</span>
        </div>
      </div>

      <!-- Language -->
      <div class="space-y-1">
        <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</label>
        <div class="text-base font-medium text-slate-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 uppercase">
          {{ user?.language_code || 'EN' }}
        </div>
      </div>

    </div>

    <!-- Account Stats (Optional Polish) -->
    <div class="pt-6">
      <h3 class="text-sm font-bold text-slate-900 mb-4">Account Activity</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
          <div class="text-indigo-100 text-xs font-medium mb-1">Joined Date</div>
          <div class="font-bold text-lg">{{ formatDate(user?.createdAt) }}</div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">Last Updated</div>
          <div class="font-bold text-lg text-slate-900">{{ formatDate(user?.updatedAt) }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../store/authStore";
import { Edit } from "lucide-vue-next";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const formatDate = (isoStr) => {
  if (!isoStr) return 'N/A';
  return new Date(isoStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>