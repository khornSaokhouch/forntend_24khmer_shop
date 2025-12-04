<template>
  <!-- Navbar using pure Tailwind CSS classes -->
  <nav class="bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-indigo-500/10 sticky top-0 z-50 relative overflow-hidden">
    <!-- Animated background gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex items-center justify-between h-20">
        <!-- Left: Logo and Navigation -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0 group">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img
                src="@/assets/logo.png"
                alt="Shopping Store Logo"
                class="w-12 h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
              />
            </div>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link 
              v-for="link in navLinks" 
              :key="link.to" 
              :to="link.to" 
              class="group relative px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-600 transition-all duration-300 overflow-hidden router-link-exact-active:text-indigo-600"
              active-class="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 shadow-inner"
            >
              <!-- Hover background effect -->
              <span class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span class="relative z-10">{{ link.text }}</span>
            </router-link>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="hidden lg:flex flex-1 max-w-lg mx-8 group">
          <div class="relative w-full">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search class="w-5 h-5 text-indigo-500" />
              </span>
              <input
                type="text"
                placeholder="Search for anything magical..."
                class="w-full bg-transparent text-slate-800 placeholder-slate-500 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-6">
          <!-- Desktop Icons -->
          <div class="hidden md:flex items-center space-x-4">
            <router-link to="/favorites" class="group text-slate-600 hover:text-indigo-600 transition-all duration-300 p-2 rounded-xl hover:bg-white/50 hover:shadow-lg hover:scale-110">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <Heart class="w-6 h-6 relative z-10 group-hover:fill-current group-hover:text-pink-500 transition-all duration-300" />
              </div>
            </router-link>

            <router-link to="/cart" class="group relative text-slate-600 hover:text-indigo-600 transition-all duration-300 p-2 rounded-xl hover:bg-white/50 hover:shadow-lg hover:scale-110">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <ShoppingCart class="w-6 h-6 relative z-10 group-hover:text-emerald-500 transition-all duration-300" />
              </div>
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-bounce"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </div>

          <!-- Divider -->
          <div class="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

          <!-- Profile Section -->
          <div class="hidden md:flex items-center">
            <div v-if="user" class="relative group">
              <router-link to="/profile" class="block">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div v-if="user.profile_image" class="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/50 group-hover:ring-indigo-500/50 transition-all duration-300 relative z-10 shadow-lg">
                    <img :src="`${API_URL}/${user.profile_image}`" alt="Profile" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/50 group-hover:ring-indigo-500/50 transition-all duration-300 relative z-10 shadow-lg">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
              </router-link>
            </div>
            <div v-else>
              <router-link to="/login" class="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <!-- Hover gradient effect -->
                <span class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                <span class="relative z-10">Login</span>
              </router-link>
            </div>
          </div>
          
          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="group text-slate-600 hover:text-indigo-600 transition-all duration-300 p-2 rounded-xl hover:bg-white/50 hover:shadow-lg">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <Menu v-if="!isMobileMenuOpen" class="w-7 h-7 relative z-10 group-hover:text-indigo-600 transition-colors duration-300" />
                <X v-else class="w-7 h-7 relative z-10 group-hover:text-indigo-600 transition-colors duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/30 shadow-2xl">
        <div class="px-4 pt-4 pb-6 space-y-2">
          <router-link 
            v-for="link in mobileNavLinks" 
            :key="link.to" 
            :to="link.to" 
            class="group flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 transition-all duration-300"
            active-class="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 shadow-inner"
            @click="isMobileMenuOpen = false"
          >
            <div class="flex items-center">
              <div class="relative mr-3">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <component :is="link.icon" class="w-5 h-5 relative z-10 group-hover:text-indigo-600 transition-colors duration-300" />
              </div>
              <span class="group-hover:text-indigo-600 transition-colors duration-300">{{ link.text }}</span>
            </div>
          </router-link>

          <!-- Mobile User Section -->
          <div class="pt-4 mt-4 border-t border-slate-200/50">
            <div v-if="user" class="group">
              <router-link to="/profile" class="flex items-center p-3 rounded-xl bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm hover:from-indigo-50/50 hover:to-purple-50/30 transition-all duration-300" @click="isMobileMenuOpen = false">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div v-if="user.profile_image" class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative z-10 shadow-lg">
                    <img :src="`${API_URL}/${user.profile_image}`" alt="Profile" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 relative z-10 shadow-lg">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-base font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">{{ user.name }}</div>
                  <div class="text-sm text-slate-500">{{ user.email }}</div>
                </div>
              </router-link>
            </div>
            <div v-else class="px-2">
              <router-link to="/login" class="group block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold relative overflow-hidden" @click="isMobileMenuOpen = false">
                 <!-- Hover gradient effect -->
                <span class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span class="relative z-10">Login to Your Account</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../store/authStore";
import { useShoppingCartStore } from "../store/useShoppingCartStore";
import { Search, Heart, ShoppingCart, Home, Box, List, Info, Phone, Menu, X } from "lucide-vue-next";

const isMobileMenuOpen = ref(false);
const authStore = useAuthStore();
const cartStore = useShoppingCartStore();
const API_URL = import.meta.env.VITE_API_URL;

const cartCount = ref(0);

// reactive user
const user = computed(() => authStore.user);

// Navbar links (no change)
const navLinks = [
  { to: "/", text: "Home" },
  { to: "/products", text: "Products" },
  { to: "/categories", text: "Categories" },
  { to: "/about", text: "About" },
  { to: "/contact", text: "Contact Us" },
];

const mobileNavLinks = [
  { to: "/", text: "Home", icon: Home },
  { to: "/products", text: "Products", icon: Box },
  { to: "/categories", text: "Categories", icon: List },
  { to: "/favorites", text: "Favorites", icon: Heart },
  { to: "/cart", text: "Shopping Cart", icon: ShoppingCart },
  { to: "/about", text: "About", icon: Info },
  { to: "/contact", text: "Contact Us", icon: Phone },
];

const updateCartCount = () => {
  if (!cartStore.cart || !cartStore.cart.items) {
    cartCount.value = 0;
    return;
  }
  cartCount.value = cartStore.cart.items.reduce((sum, item) => sum + item.qty, 0);
};

const fetchCart = async () => {
  if (user.value) {
    await cartStore.fetchCart();
    updateCartCount();
  }
};

onMounted(async () => {
  // load auth from session storage
  authStore.loadFromStorage();

  // if token exists but no user in memory, fetch from backend (/auth/user)
  if (authStore.token && !authStore.user) {
    await authStore.loadUser();
  }

  // once user is ready, load cart
  await fetchCart();
});

// update cart count when cart changes
watch(
  () => cartStore.cart,
  () => updateCartCount(),
  { deep: true }
);

// logout cleanup
watch(user, (newUser) => {
  if (!newUser) {
    cartCount.value = 0;
    isMobileMenuOpen.value = false;
  }
});
</script>


<!-- The <style scoped> block is no longer needed -->