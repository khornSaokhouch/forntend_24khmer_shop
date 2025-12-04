<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-40 h-40 bg-blue-200/50 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-56 h-56 bg-cyan-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="relative z-10 p-6 max-w-7xl mx-auto py-16">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          My Favourites
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Here are the products you've saved. Keep track of what you love and never lose sight of a great find.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="favouriteStore.loading" class="flex justify-center items-center py-20">
        <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="favouriteStore.error" class="text-center py-20">
        <div class="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-600 font-medium">{{ favouriteStore.error }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="favouriteStore.favourites.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">No Favourites Yet</h3>
          <p class="text-slate-600 mb-8">Click the heart on any product to save it here.</p>
          <router-link to="/products" class="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            Browse Products
          </router-link>
        </div>
      </div>

      <!-- Favourites Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductCard
          v-for="fav in favouriteStore.favourites"
          :key="fav.id"
          :product="fav.product"
          :API_URL="API_URL"
          @remove="removeFavourite(fav.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/ProductCard.vue";

const favouriteStore = useFavouriteStore();
const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const toast = useToast();

onMounted(() => {
  if (authStore.user) favouriteStore.fetchFavourites();
});

// Remove favourite function (works with toast)
const removeFavourite = async (id) => {
  const fav = favouriteStore.favourites.find(f => f.id === id);
  if (!fav) return;

  favouriteStore.favourites = favouriteStore.favourites.filter(f => f.id !== id);
  try {
    await favouriteStore.removeFavourite(id);
    toast.success("Removed from favourites!");
  } catch {
    favouriteStore.favourites.push(fav);
    toast.error("Failed to remove favourite.");
  }
};
</script>
