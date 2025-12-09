<template>
  <div class="min-h-screen flex flex-col ">
    <!-- Navbar -->
    <Navbar />

    <div class="flex-grow pt-5 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row gap-6 lg:gap-8 h-full">
        
        <!-- SIDEBAR (Desktop Only) -->
        <aside class="hidden md:block w-72 flex-shrink-0 space-y-6">
          
          <!-- User Info Card -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex flex-col items-start">
              <div class="relative w-24 h-24 mb-4 group">
                <img 
                  v-if="userImage" 
                  :src="userImage" 
                  class="relative w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
                  alt="Profile"
                />
                <div v-else class="relative w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-3xl font-bold border-4 border-white">
                  {{ authStore.user?.first_name?.charAt(0) }}
                </div>
              </div>

              <!-- DESKTOP NAME DISPLAY -->
              <h2 class="text-xl font-bold text-slate-900">
                {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
              </h2>
              <p class="text-sm text-slate-500 font-medium mb-1">@{{ authStore.user?.username }}</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                {{ authStore.user?.role || 'Member' }}
              </span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
            <ul class="space-y-1">
              <li v-for="item in menuItems" :key="item.to">
                <router-link 
                  :to="item.to" 
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  active-class="bg-indigo-50 text-indigo-600 shadow-sm"
                  :class="$route.path === item.to ? '' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
                >
                  <component :is="item.icon" class="w-5 h-5" />
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
            
            <div class="mt-4 pt-4 border-t border-slate-100">
              <button 
                @click="showLogoutModal = true"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut class="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <main class="flex-1 min-w-0">
          
          <!-- MOBILE HEADER & TABS (Visible only on phone) -->
          <div class="md:hidden mb-6">
            
            <!-- Mobile User Summary -->
            <div class="flex items-center gap-4 mb-4">
               <div class="w-14 h-14 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                 <img v-if="userImage" :src="userImage" class="w-full h-full object-cover" />
                 <div v-else class="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {{ authStore.user?.first_name?.charAt(0) }}
                 </div>
               </div>
               <div>
                 <!-- MOBILE NAME DISPLAY (Fixed) -->
                 <h2 class="text-lg font-bold text-slate-900 leading-tight">
                    {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
                 </h2>
                 <p class="text-xs text-slate-500">@{{ authStore.user?.username }}</p>
               </div>
            </div>

            <!-- Mobile Scrollable Menu -->
            <div class="flex overflow-x-auto pb-2 gap-2 no-scrollbar items-center">
               <router-link 
                  v-for="item in menuItems" 
                  :key="item.to" 
                  :to="item.to"
                  class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors"
                  active-class="bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  :class="$route.path === item.to ? '' : 'bg-white text-slate-600 border-slate-200'"
                >
                  {{ item.label }}
                </router-link>

                <!-- MOBILE LOGOUT BUTTON -->
                <button 
                  @click="showLogoutModal = true"
                  class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-red-200 bg-red-50 text-red-600 flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform"
                >
                  <LogOut class="w-3.5 h-3.5" />
                  Sign Out
                </button>
            </div>
          </div>

          <!-- Content View -->
          <div class="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 min-h-[500px]">
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
    </div>
    
    <!-- Logout Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showLogoutModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showLogoutModal = false"></div>
        <div class="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform transition-all">
          <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Sign Out?</h3>
          <p class="text-slate-500 mb-8">Are you sure you want to end your session?</p>
          <div class="flex gap-3">
            <button @click="showLogoutModal = false" class="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button @click="handleLogout" class="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors">
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar.vue";
import { User, ShoppingBag, Heart, Shield, LogOut, Edit  } from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();
const showLogoutModal = ref(false);

const menuItems = [
  { label: 'My Profile', to: '/profile', icon: User },
  { label: 'Orders', to: '/profile/orders', icon: ShoppingBag },
  { label: 'Wishlist', to: '/favorites', icon: Heart },
  // { label: 'Security', to: '/profile/security', icon: Shield },
];

const userImage = computed(() => {
  const img = authStore.user?.image;
  if (!img) return null;
  return img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}/${img}`;
});

const handleLogout = () => {
  authStore.logout();
  showLogoutModal.value = false;
  router.push('/login');
};
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>