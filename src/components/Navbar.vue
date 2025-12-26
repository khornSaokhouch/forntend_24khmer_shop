<template>
  <div>
    <!-- ============================================== -->
    <!-- DESKTOP & TABLET TOP NAVBAR -->
    <!-- ============================================== -->
    <nav class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20">
          
          <!-- LEFT: Logo -->
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2 group">
            <div class="relative w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
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
            
        <!-- Desktop Search -->
<div class="hidden lg:block relative group">
  <input 
    v-model="searchQuery"
    type="text" 
    placeholder="Search products..." 
    class="w-48 focus:w-64 transition-all duration-300 bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
  />
  <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />

  <!-- Dropdown -->
  <ul v-if="searchQuery && filteredProducts.length" class="absolute mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
    <li 
      v-for="product in filteredProducts" 
      :key="product._id"
      @click="goToProduct(product)"
      class="px-4 py-2 cursor-pointer hover:bg-indigo-50"
    >
      {{ product.name }}
    </li>
  </ul>
</div>


            <!-- Mobile Search Toggle -->
            <button @click="isSearchOpen = !isSearchOpen" class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Search class="w-6 h-6" />
            </button>

            <!-- Actions (Desktop Only) -->
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
                      v-if="userImage" 
                      :src="userImage" 
                      alt="Profile" 
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                      {{ user.first_name?.charAt(0).toUpperCase() }}
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
      v-model="searchQuery"
      class="w-full bg-slate-50 text-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      autofocus
    />
    <button @click="isSearchOpen = false" class="absolute right-3 top-3 p-1 text-slate-400">
      <X class="w-5 h-5" />
    </button>

    <!-- Dropdown -->
    <ul
      v-if="searchQuery && filteredProducts.length > 0"
      class="absolute left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50"
    >
      <li
        v-for="product in filteredProducts"
        :key="product._id"
        class="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
        @mousedown.prevent="goToProduct(product)"
      >
        {{ product.name }}
      </li>
    </ul>

    <!-- No results message -->
    <div v-if="searchQuery && filteredProducts.length === 0" class="mt-2 text-sm text-slate-500">
      No products found.
    </div>
  </div>
</div>

    </nav>

    <!-- ============================================== -->
    <!-- MOBILE BOTTOM NAVIGATION -->
    <!-- ============================================== -->
    <div class="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 pb-safe z-50">
      <div class="flex justify-around items-center h-16 px-2">
        <!-- Keep mobile nav unchanged -->
      </div>
      <div class="h-1 bg-transparent w-full"></div>
    </div>
    
    <div class="h-16 md:h-20"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { useShoppingCartStore } from "../store/useShoppingCartStore";
import { useProductStore } from '@/store/useProductStore';
import { Search, ShoppingBag, Heart, ShoppingCart, ArrowRight, X, Home, Grid, User } from 'lucide-vue-next';

const searchQuery = ref('');
const isSearchFocused = ref(false);
const isSearchOpen = ref(false);
const productStore = useProductStore();
const router = useRouter();


// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return [];
  return productStore.products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


// Navigate to product page when selecting
const goToProduct = (product) => {
  router.push(`/product/${slugify(product.name)}`);
  searchQuery.value = '';
  isSearchOpen.value = false;
};


// Hide dropdown on blur (desktop)
const onBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false;
  }, 100);
};

// Navbar state
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useShoppingCartStore();

const cartCount = ref(0);
const user = computed(() => authStore.user);

const navLinks = [
  { to: "/", text: "Home" },
  { to: "/products", text: "Shop" },
  { to: "/categories", text: "Categories" },
  { to: "/about", text: "About" },
];

const updateCartCount = () => {
  const items = cartStore.cart?.items || [];
  cartCount.value = items.reduce((sum, item) => sum + (item.qty || 0), 0);
};

const userImage = computed(() => {
  if (!user.value?.image) return null;
  return user.value.image.startsWith("http") ? user.value.image : import.meta.env.VITE_API_URL + "/" + user.value.image;
});

const initData = async () => {
  authStore.loadFromStorage();
  if (authStore.token && !authStore.user) await authStore.loadUser();
  if (authStore.user) {
    await cartStore.fetchCart();
    updateCartCount();
  }
};

const slugify = (text) =>
  (text ?? "").toString().toLowerCase().trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");


onMounted(() => initData());

watch(() => cartStore.cart, updateCartCount, { deep: true });
watch(user, (newUser) => { if (!newUser) cartCount.value = 0; });
watch(() => route.path, () => { isSearchOpen.value = false; });
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
