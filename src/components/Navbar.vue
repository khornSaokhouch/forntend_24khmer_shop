<template>
  <div>
    <!-- ============================================== -->
    <!-- DESKTOP & TABLET TOP NAVBAR (Hidden on small mobile) -->
    <!-- ============================================== -->
    <nav class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20">
          
          <!-- LEFT: Logo -->
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2 group">
            <div class="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <!-- Replaced Image with Icon for demo reliability, put your <img> back here if needed -->
              <ShoppingBag class="text-white w-6 h-6" /> 
            </div>
            <span class="hidden sm:block font-bold text-xl tracking-tight text-slate-800">
              Mini<span class="text-indigo-600">Store</span>
            </span>
          </router-link>

          <!-- CENTER: Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-full border border-slate-100 mx-4">
            <router-link 
              v-for="link in navLinks" 
              :key="link.to" 
              :to="link.to" 
              class="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200"
              active-class="bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
            >
              {{ link.text }}
            </router-link>
          </div>

          <!-- RIGHT: Utilities & Profile -->
          <div class="flex items-center gap-2 sm:gap-4">
            
            <!-- Desktop Search Input -->
            <div class="hidden lg:block relative group">
              <input 
                type="text" 
                placeholder="Search..." 
                class="w-48 focus:w-64 transition-all duration-300 bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
              />
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            </div>

            <!-- Mobile Search Toggle (Visible only on mobile top bar) -->
            <button @click="isSearchOpen = !isSearchOpen" class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Search class="w-6 h-6" />
            </button>

            <!-- Actions (Desktop Only - Mobile has Bottom Bar) -->
            <div class="hidden md:flex items-center gap-2">
              <router-link to="/favorites" class="p-2 text-slate-600 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors relative">
                <Heart class="w-6 h-6" />
              </router-link>
              
              <router-link to="/cart" class="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
                <ShoppingCart class="w-6 h-6" />
                <span v-if="cartCount > 0" class="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  {{ cartCount }}
                </span>
              </router-link>
            </div>

            <!-- Profile Dropdown / Login -->
            <div class="pl-2 border-l border-slate-200 ml-2">
              <template v-if="user">
                <router-link to="/profile" class="flex items-center gap-2 group">
                  <div class="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500 transition-all bg-slate-200">
                    <img 
                      v-if="user.profile_image" 
                      :src="`${API_URL}/${user.profile_image}`" 
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                      {{ user.name?.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                </router-link>
              </template>
              
              <template v-else>
                <router-link to="/login" class="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium rounded-full transition-colors shadow-lg shadow-indigo-500/20">
                  <span>Login</span>
                  <ArrowRight class="w-4 h-4" />
                </router-link>
              </template>
            </div>

          </div>
        </div>
      </div>

      <!-- Mobile Search Overlay -->
      <div v-if="isSearchOpen" class="lg:hidden absolute top-full left-0 w-full bg-white p-4 shadow-xl border-b border-slate-100 animate-in slide-in-from-top-2">
        <div class="relative">
          <Search class="absolute left-4 top-3.5 w-5 h-5 text-indigo-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            class="w-full bg-slate-50 text-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autofocus
          />
          <button @click="isSearchOpen = false" class="absolute right-3 top-3 p-1 text-slate-400">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>

    <!-- ============================================== -->
    <!-- MOBILE BOTTOM NAVIGATION (The "App" Feel) -->
    <!-- ============================================== -->
    <div class="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 pb-safe z-50">
      <div class="flex justify-around items-center h-16 px-2">
        
        <router-link to="/" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500" active-class="text-indigo-600">
          <Home class="w-6 h-6" :class="{ 'fill-current': $route.path === '/' }" />
          <span class="text-[10px] font-medium">Home</span>
        </router-link>

        <router-link to="/categories" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500" active-class="text-indigo-600">
          <Grid class="w-6 h-6" :class="{ 'fill-current': $route.path === '/categories' }" />
          <span class="text-[10px] font-medium">Catg.</span>
        </router-link>

        <!-- Center Cart Button (Floating Effect) -->
        <div class="relative -top-5">
          <router-link to="/cart" class="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40 text-white transform transition-transform active:scale-95">
            <ShoppingCart class="w-6 h-6" />
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {{ cartCount }}
            </span>
          </router-link>
        </div>

        <router-link to="/favorites" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500" active-class="text-pink-500">
          <Heart class="w-6 h-6" :class="{ 'fill-current': $route.path === '/favorites' }" />
          <span class="text-[10px] font-medium">Saved</span>
        </router-link>

        <router-link :to="user ? '/profile' : '/login'" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500" active-class="text-indigo-600">
          <User class="w-6 h-6" :class="{ 'fill-current': $route.path === '/profile' }" />
          <span class="text-[10px] font-medium">{{ user ? 'Profile' : 'Login' }}</span>
        </router-link>

      </div>
      <!-- Safe Area Spacing for iPhone X+ -->
      <div class="h-1 bg-transparent w-full"></div>
    </div>
    
    <!-- Spacer to prevent content hiding behind fixed navs -->
    <div class="h-16 md:h-20"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { useShoppingCartStore } from "../store/useShoppingCartStore";
// Imported Lucide Icons - Ensure you have lucide-vue-next installed
import { 
  Search, Heart, ShoppingCart, Home, 
  ShoppingBag, User, Grid, ArrowRight, X 
} from "lucide-vue-next";

const route = useRoute();
const authStore = useAuthStore();
const cartStore = useShoppingCartStore();
const API_URL = import.meta.env.VITE_API_URL || '';

// State
const isSearchOpen = ref(false);
const cartCount = ref(0);

// Computed
const user = computed(() => authStore.user);

// Links Configuration
const navLinks = [
  { to: "/", text: "Home" },
  { to: "/products", text: "Shop" },
  { to: "/categories", text: "Categories" },
  { to: "/about", text: "About" },
];

// Logic to calculate cart items
const updateCartCount = () => {
  // Safe navigation (?.) ensures app doesn't crash if cart is null
  const items = cartStore.cart?.items || [];
  cartCount.value = items.reduce((sum, item) => sum + (item.qty || 0), 0);
};

// Fetch data
const initData = async () => {
  try {
    authStore.loadFromStorage();
    if (authStore.token && !authStore.user) {
      await authStore.loadUser();
    }
    if (authStore.user) {
      await cartStore.fetchCart();
      updateCartCount();
    }
  } catch (error) {
    console.error("Nav init error:", error);
  }
};

onMounted(() => {
  initData();
});

// Watchers for reactivity
watch(() => cartStore.cart, updateCartCount, { deep: true });

// Close search when route changes
watch(() => route.path, () => {
  isSearchOpen.value = false;
});

// Reset when user logs out
watch(user, (newUser) => {
  if (!newUser) cartCount.value = 0;
});
</script>

<style scoped>
/* Utility for iPhone Safe Area in bottom nav */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>