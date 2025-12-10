<template>
  <div class="min-h-screen bg-slate-50 flex font-sans text-slate-800">
    
    <!-- ============================================== -->
    <!-- MOBILE SIDEBAR OVERLAY (Backdrop) -->
    <!-- ============================================== -->
    <transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
      ></div>
    </transition>

    <!-- ============================================== -->
    <!-- SIDEBAR NAVIGATION (Mobile & Desktop) -->
    <!-- ============================================== -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl md:shadow-none md:border-r-0 md:static md:flex flex-col transition-transform duration-300 ease-in-out transform"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <!-- Logo Area -->
      <div class="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <router-link to="/dashboard" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <LayoutDashboard class="w-6 h-6" />
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
            AdminPanel
          </span>
        </router-link>
        
        <!-- Close Button (Mobile Only) -->
        <button @click="isSidebarOpen = false" class="md:hidden p-2 text-slate-400 hover:text-slate-600">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="isSidebarOpen = false"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
          active-class="bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
          :class="$route.path === link.to ? '' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <!-- Active Indicator Bar -->
          <span 
            v-if="$route.path === link.to" 
            class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-600 rounded-r-full"
          ></span>

          <component 
            :is="link.icon" 
            class="w-5 h-5 flex-shrink-0 transition-colors"
            :class="$route.path === link.to ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'"
          />
          <span class="relative z-10">{{ link.text }}</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer (Profile Summary) -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm overflow-hidden">
            <img v-if="userImage" :src="userImage" class="w-full h-full object-cover" />
            <span v-else>{{ profile?.first_name?.charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-900 truncate">
              {{ profile?.first_name }} {{ profile?.last_name }}
            </p>
            <p class="text-xs text-slate-500 truncate capitalize">{{ profile?.role || 'Admin' }}</p>
          </div>
        </div>
      </div>
    </aside>


    <!-- ============================================== -->
    <!-- MAIN CONTENT AREA -->
    <!-- ============================================== -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      
      <!-- Top Header -->
      <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
        
        <!-- Left: Hamburger & Title -->
        <div class="flex items-center gap-4">
          <button 
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          >
            <Menu class="w-6 h-6" />
          </button>
          
          <h1 class="text-lg sm:text-xl font-bold text-slate-800 hidden sm:block">
            {{ currentRouteName }}
          </h1>
        </div>

        <!-- Right: Profile Dropdown -->
        <div class="relative">
          <button 
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-3 p-1.5 pl-3 pr-2 rounded-full border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all bg-white"
          >
            <span class="text-sm font-medium text-slate-700 hidden sm:block">My Account</span>
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner overflow-hidden">
               <img v-if="userImage" :src="userImage" class="w-full h-full object-cover" />
               <span v-else>{{ profile?.first_name?.charAt(0) }}</span>
            </div>
            <ChevronDown class="w-4 h-4 text-slate-400" :class="{ 'rotate-180': dropdownOpen }" />
          </button>

          <!-- Dropdown Menu -->
          <transition 
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div 
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 z-50 overflow-hidden origin-top-right"
            >
              <div class="px-4 py-3">
                <p class="text-xs text-slate-500">Signed in as</p>
                <p class="text-sm font-bold text-slate-900 truncate">{{ profile?.email }}</p>
              </div>
              <div class="py-1">
                <router-link to="/dashboard/profile" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                  <User class="w-4 h-4" /> Profile
                </router-link>
                <!-- Add other links here if needed -->
              </div>
              <div class="py-1">
                <button 
                  @click="openLogoutModal" 
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut class="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </transition>
        </div>
      </header>

      <!-- Main Router View -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 bg-white lg:p-8">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition 
              enter-active-class="transition ease-out duration-200" 
              enter-from-class="opacity-0 translate-y-2" 
              enter-to-class="opacity-100 translate-y-0" 
              mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- ============================================== -->
    <!-- LOGOUT MODAL -->
    <!-- ============================================== -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showLogoutModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showLogoutModal = false"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform transition-all scale-100">
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-short">
            <LogOut class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Sign Out?</h3>
          <p class="text-slate-500 mb-8">Are you sure you want to end your session?</p>
          <div class="flex gap-3">
            <button 
              @click="showLogoutModal = false" 
              class="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmLogout" 
              class="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Users,
  Folder,
  Package,
  Calendar,
  Tag,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ===== STATE =====
const isSidebarOpen = ref(false);
const dropdownOpen = ref(false);
const showLogoutModal = ref(false);
const profile = ref(authStore.user || null); // start with persisted user

// ===== NAV LINKS =====
const navLinks = [
  { to: "/dashboard", text: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/users", text: "Users", icon: Users },
  { to: "/dashboard/category", text: "Categories", icon: Folder },
  { to: "/dashboard/products", text: "Products", icon: Package },
  { to: "/dashboard/events", text: "Events", icon: Calendar },
  { to: "/dashboard/promotions", text: "Promotions", icon: Tag },
];

// ===== COMPUTED =====
const currentRouteName = computed(() => {
  const activeLink = navLinks.find(link => link.to === route.path);
  return activeLink ? activeLink.text : "Dashboard";
});

const userImage = computed(() => {
  const img = profile.value?.image;
  if (!img) return null;
  return img.startsWith("http") ? img : `${API_URL}/${img}`;
});

// ===== LIFECYCLE =====
onMounted(async () => {
  // Only loadUser if token exists and user not yet set
  if (authStore.token && !authStore.user) {
    await authStore.loadUser();
  }
  profile.value = authStore.user;
});

// ===== WATCHERS =====
watch(
  () => authStore.user,
  (newUser) => {
    profile.value = newUser;
  }
);

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false;
    dropdownOpen.value = false;
  }
);

// ===== ACTIONS =====
const openLogoutModal = () => {
  dropdownOpen.value = false;
  showLogoutModal.value = true;
};

const confirmLogout = async () => {
  showLogoutModal.value = false;
  await authStore.logout();
  profile.value = null;
  router.push("/login");
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>