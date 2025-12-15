<template>
  <div 
    ref="sectionTarget"
    class="relative w-full py-12 md:py-20 "
  >
    <!-- Background Decor (Optional Blob) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

    <div 
      class="container mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ease-out"
      :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
    >
      
      <!-- Section Header -->
      <div class="text-center mb-8 md:mb-14">
        <h1 
          class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight transition-all duration-700 ease-out"
          :class="isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        >
          Our <span class="text-blue-600">Collection</span>
        </h1>
        <p 
          class="mt-3 md:mt-4 text-sm md:text-lg text-slate-500 max-w-2xl mx-auto"
          :class="isSectionVisible ? 'opacity-100' : 'opacity-0 translate-y-4'"
        >
          Explore our latest arrivals and premium products designed for you.
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
        <div v-for="n in 8" :key="n" class="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
          <div class="w-full aspect-[4/5] rounded-xl bg-slate-200 animate-pulse mb-3"></div>
          <div class="h-4 w-3/4 rounded bg-slate-200 animate-pulse mb-2"></div>
          <div class="h-4 w-1/2 rounded bg-slate-200 animate-pulse"></div>
        </div>
      </div>

      <!-- Product Grid -->
      <!-- NOTE: grid-cols-2 forces 2 items per row on mobile -->
      <transition-group
        v-else-if="isSectionVisible && nonPromotedProducts.length > 0"
        tag="div"
        name="list-fade"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8"
      >
        <ProductCard
          v-for="(product, index) in nonPromotedProducts"
          :key="product._id"
          :product="product"
          :API_URL="API_URL"
          :style="{ transitionDelay: `${index * 50}ms` }"
        />
      </transition-group>

      <!-- Empty State -->
      <div v-if="!loading && nonPromotedProducts.length === 0" 
           class="flex flex-col items-center justify-center py-20 text-slate-400"
      >
        <div class="p-4 rounded-full bg-slate-100 mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
        </div>
        <p class="text-lg">No products found.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useIntersectionObserver } from "@vueuse/core";

// Stores
const productStore = useProductStore();
const categoryStore = useCategoryStore();

// State
const loading = ref(true);
const API_URL = import.meta.env.VITE_API_URL;

// Intersection Observer
const sectionTarget = ref(null);
const isSectionVisible = ref(false);
const { stop } = useIntersectionObserver(
  sectionTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isSectionVisible.value = true;
      stop();
    }
  },
  { threshold: 0.1 }
);

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      productStore.fetchProducts(),
      categoryStore.fetchCategories()
    ]);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    loading.value = false;
  }
});

const nonPromotedProducts = computed(() =>
  productStore.products.filter(p => {
    const promos = Array.isArray(p.promotions) ? p.promotions : [];
    return promos.length === 0;
  })
);
</script>

<style scoped>
/* Smooth fade up animation for grid items */
.list-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.list-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-fade-move {
  transition: transform 0.5s ease;
}
</style>