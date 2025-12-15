<template>
  <div
    v-if="product"
    class="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
  >
    <!-- Image Container -->
    <div class="relative overflow-hidden aspect-[4/5] sm:aspect-square bg-slate-100">
      <router-link :to="`/product/${slugify(product.name)}`" class="block h-full w-full">
        <img
          :src="product.image_product || '/placeholder.png'"
          :alt="product.name"
          class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </router-link>
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
         <span v-if="product.stock <= 5 && product.stock > 0" class="px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/90 backdrop-blur-sm rounded-md">
           Low Stock
         </span>
         <span v-if="product.stock === 0" class="px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-slate-800/90 backdrop-blur-sm rounded-md">
           Sold Out
         </span>
      </div>

      <!-- Quick Action (Desktop Hover) -->
      <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
        <button class="w-full py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
          View Details
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <!-- p-3 for mobile (tight fit), p-5 for desktop -->
    <div class="flex flex-col flex-1 p-3 sm:p-5">
      
      <!-- Title -->
      <div class="mb-1 sm:mb-2">
        <router-link
          :to="`/product/${slugify(product.name)}`"
          class="text-sm sm:text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 leading-tight sm:leading-snug"
          :title="product.name"
        >
          {{ product.name || "Unknown Product" }}
        </router-link>
      </div>

      <!-- Description (Hidden on tiny mobile screens to save space) -->
      <p class="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 hidden xs:block">
        {{ product.description }}
      </p>

      <!-- Price & Action Bottom -->
      <div class="mt-auto pt-2 flex items-end justify-between border-t border-slate-50 sm:border-none">
        <div class="flex flex-col">
          <span class="text-[10px] sm:text-xs text-slate-400 font-medium">Price</span>
          <span class="text-base sm:text-xl font-extrabold text-slate-900">
            ${{ Number(product.price ?? 0).toFixed(2) }}
          </span>
        </div>
        
        <!-- Mobile "Add" Icon / Status Dot -->
        <div class="sm:hidden">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Fallback if prop missing -->
  <div v-else class="h-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center p-6 text-slate-400 text-sm">
    Product not available
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: false },
  API_URL: { type: String, required: true },
});

const slugify = (text) =>
  text?.toString().toLowerCase().trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-") || "";
</script>