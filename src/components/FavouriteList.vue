<template>
  <div class="min-h-screen  relative overflow-x-hidden">
    <!-- Main Container -->
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      
      <!-- Header Section -->
      <div class="text-center mb-8 md:mb-16">
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 md:mb-4">
          My Favourites
        </h1>
        <p class="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Here are the products you've saved.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="favouriteStore.loading" class="flex justify-center items-center py-20">
        <div class="w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="favouriteStore.error" class="flex justify-center py-10">
        <div class="w-full max-w-lg p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-red-100 shadow-sm text-center">
          <p class="text-red-600 font-medium">{{ favouriteStore.error }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="validFavourites.length === 0" class="flex justify-center py-10 md:py-20">
        <div class="w-full max-w-md p-8 text-center rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200 shadow-lg">
          <div class="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Favourites Yet</h3>
          <router-link 
            to="/" 
            class="inline-flex items-center justify-center mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            Browse Products
          </router-link>
        </div>
      </div>

      <!-- Favourites Grid -->
      <!-- 
         UPDATED RESPONSIVE CLASSES:
         1. grid-cols-2: Shows 2 cards on mobile (default)
         2. md:grid-cols-3: Shows 3 cards on tablets
         3. lg:grid-cols-4: Shows 4 cards on desktop
         4. gap-3: Smaller gap on mobile to fit 2 cards better
      -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        <ProductCard
          v-for="fav in validFavourites"
          :key="fav._id"
          :product="fav.product_id" 
          class="w-full h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/ProductCard.vue";

const favouriteStore = useFavouriteStore();
const authStore = useAuthStore();

const validFavourites = computed(() => {
  return favouriteStore.favourites.filter(
    (fav) => fav.product_id && typeof fav.product_id === 'object'
  );
});

onMounted(async () => {
  if (authStore.user) {
    await favouriteStore.fetchFavourites();
  }
});
</script>