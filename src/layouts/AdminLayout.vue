<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="flex">
      
      <!-- Desktop Sidebar -->
      <aside class="w-72 p-4 hidden md:flex flex-col flex-shrink-0">
        <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 h-full flex flex-col shadow-lg">
          <!-- Logo/Header -->
          <div class="mb-8 text-center">
            <router-link to="/dashboard" class="inline-block text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Admin Panel
            </router-link>
          </div>

          <!-- Navigation Links with Icons -->
          <nav class="flex-1 flex flex-col space-y-2">
            <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="group flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 text-slate-600 hover:bg-slate-100"
              active-class="!bg-gradient-to-r !from-blue-100 !to-cyan-100 !text-blue-700 font-semibold shadow-inner"
            >
              <component :is="link.icon" class="w-5 h-5 group-hover:text-blue-600 transition-colors" />
              <span>{{ link.text }}</span>
            </router-link>
          </nav>

          <!-- Logout Button - Triggers Modal -->
          <button
            @click="showLogoutModal = true"
            class="mt-auto group flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
          >
            <LogOut class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <!-- FIX #1: Added `relative z-10` to this parent container. This creates a shared stacking context for the header and main content below it. -->
      <div class="flex-1 flex flex-col min-h-screen relative z-10">
        <!-- FIX #2: Added `relative z-20` to the header. This ensures the header is always stacked above the main content area within their shared context. -->
        <header class="p-6 relative z-20">
          <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-4 flex justify-between items-center">
            <button @click="isSidebarOpen = true" class="md:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu class="w-6 h-6 text-slate-700" />
            </button>
            <div class="hidden md:block text-xl font-semibold text-slate-700">Dashboard</div>
            <div class="relative" v-if="authStore.user" ref="dropdownRef">
              <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none p-2 rounded-lg hover:bg-slate-100">
                <img v-if="authStore.user.profile_image" :src="`${API_URL}/${authStore.user.profile_image}`" alt="Profile" class="w-8 h-8 rounded-full object-cover"/>
                <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">{{ authStore.user.name[0] }}</div>
                <span class="hidden sm:inline font-medium text-slate-700">{{ authStore.user.name }}</span>
                <ChevronDown class="w-5 h-5 text-slate-500" />
              </button>
              
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <!-- FIX #3: Increased dropdown z-index to `z-30` for good measure. -->
                <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-blue-100 text-slate-800 rounded-xl shadow-2xl py-2 z-30">
                  <router-link to="/dashboard/profile" class="flex items-center gap-3 px-4 py-2 hover:bg-slate-100" @click="dropdownOpen = false"><User class="w-4 h-4 text-slate-500" /> Profile</router-link>
                  <router-link to="/dashboard/settings" class="flex items-center gap-3 px-4 py-2 hover:bg-slate-100" @click="dropdownOpen = false"><Settings class="w-4 h-4 text-slate-500" /> Settings</router-link>
                  <button @click="handleLogoutClick" class="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-slate-100 text-red-600"><LogOut class="w-4 h-4 text-red-500" /> Logout</button>
                </div>
              </transition>
            </div>
          </div>
        </header>

        <!-- Main Content (Router View) -->
        <main class="flex-1 px-6 pb-6">
          <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl min-h-full shadow-lg p-6">
            <router-view />
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <transition
      enter-active-class="transition ease-in-out duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside v-if="isSidebarOpen" class="fixed inset-y-0 left-0 z-40 w-72 p-4 md:hidden">
        <div class="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-6 h-full flex flex-col shadow-2xl">
          <div class="mb-8 flex justify-between items-center">
            <router-link to="/dashboard" class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Admin Panel</router-link>
            <button @click="isSidebarOpen = false" class="p-2 rounded-lg hover:bg-slate-100"><X class="w-6 h-6 text-slate-700" /></button>
          </div>
          <nav class="flex-1 flex flex-col space-y-2">
             <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              @click="isSidebarOpen = false"
              class="group flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-slate-600 hover:bg-slate-100"
              active-class="!bg-gradient-to-r !from-blue-100 !to-cyan-100 !text-blue-700 font-semibold shadow-inner"
            >
              <component :is="link.icon" class="w-5 h-5" />
              <span>{{ link.text }}</span>
            </router-link>
          </nav>
        </div>
      </aside>
    </transition>
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden"></div>

    <!-- LOGOUT POPUP MODAL -->
    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showLogoutModal = false"></div>
        <transition
          enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
        >
          <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Confirm Logout</h3>
              <p class="text-slate-600 mb-6">Are you sure you want to sign out?</p>
              <div class="flex space-x-4">
                <button @click="showLogoutModal = false" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition-colors">Cancel</button>
                <button @click="confirmLogout" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">Logout</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "vue-router";
import { LayoutDashboard, Users, Folder, Package, Calendar, LogOut, Menu, User, Settings, ChevronDown, X, Tag} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const dropdownOpen = ref(false);
const dropdownRef = ref(null);
const isSidebarOpen = ref(false);
const showLogoutModal = ref(false);

const API_URL = import.meta.env.VITE_API_URL;

const navLinks = [
  { to: "/dashboard", text: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/users", text: "Users", icon: Users },
  { to: "/dashboard/category", text: "Category", icon: Folder },
  { to: "/dashboard/products", text: "Products", icon: Package },
  { to: "/dashboard/events", text: "Events", icon: Calendar },
  { to: "/dashboard/promotions", text: "Promotions", icon: Tag },
];

const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value;

// This new function handles clicks on any logout button
const handleLogoutClick = () => {
  dropdownOpen.value = false; // Close dropdown if it's open
  showLogoutModal.value = true;
};

// This function performs the actual logout
const confirmLogout = () => {
  authStore.logout();
  showLogoutModal.value = false;
  isSidebarOpen.value = false;
  router.push("/login");
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>