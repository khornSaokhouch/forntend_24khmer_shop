<template>
  <div class="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    
    <!-- Image Link -->
    <router-link :to="`/product/${slugify(product.name)}`" class="block relative overflow-hidden">
      <!-- Image -->
      <img
        :src="product.image_product || '/placeholder.png'"
        :alt="product.name"
        class="w-full h-48 sm:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      
      <!-- Overlay for Sold Out -->
      <div v-if="product.stock === 0" class="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
        <span class="px-4 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
          Sold Out
        </span>
      </div>

      <!-- BADGES CONTAINER -->
      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <!-- New Badge (Only if stock > 0) -->
        <span 
          v-if="isNew && product.stock > 0" 
          class="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg shadow-md animate-fade-in-up"
        >
          New
        </span>
        
        <!-- Sale Badge (Example logic) -->
        <span 
          v-if="product.on_sale" 
          class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg shadow-md"
        >
          Sale
        </span>
      </div>
    </router-link>

    <!-- Favourite Button (Floating) -->
    <button
      @click.prevent="toggleFavourite(product)"
      class="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-50 shadow-md transition-colors z-10 group-hover:opacity-100"
      :class="favouriteStore.isFavourite(product) ? 'opacity-100' : 'opacity-70'"
      :disabled="favouriteStore.loading"
    >
      <svg
        v-if="favouriteStore.isFavourite(product)"
        class="w-5 h-5 text-red-600 drop-shadow-sm transition-transform active:scale-75"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
    </button>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1 gap-2">
      <!-- Category (Optional) -->
      <p class="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1 opacity-80">
        {{ product.category?.name || 'Collection' }}
      </p>

      <!-- Title -->
      <router-link :to="`/product/${slugify(product.name)}`" class="group-hover:text-blue-600 transition-colors">
        <h2 class="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
          {{ product.name }}
        </h2>
      </router-link>

      <!-- Price & Action -->
      <div class="mt-auto pt-3 flex items-end justify-between border-t border-slate-50">
        <div class="flex flex-col">
          <span class="text-xs text-slate-400 font-medium">Price</span>
          <span class="font-extrabold text-lg sm:text-xl text-slate-900">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
        
        <!-- Small 'View' Arrow -->
        <router-link 
          :to="`/product/${slugify(product.name)}`"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFavouriteStore } from "@/store/useFavouriteStore";

const props = defineProps({
  product: { type: Object, required: true },
});

const favouriteStore = useFavouriteStore();

// Logic to determine if product is New (e.g., created within last 7 days)
const isNew = computed(() => {
  if (!props.product.created_at && !props.product.createdAt) return false;
  
  const createdDate = new Date(props.product.created_at || props.product.createdAt);
  const currentDate = new Date();
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(currentDate - createdDate);
  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 7; // Show "New" if less than 7 days old
});

const slugify = (text) =>
  text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-") || "";

const toggleFavourite = async (product) => {
  await favouriteStore.toggleFavourite(product);
};
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>