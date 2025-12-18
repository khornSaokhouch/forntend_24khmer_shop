<template>
  <div ref="sectionTarget" class="relative w-full py-12 md:py-24 ">
    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-1000"
      :class="isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
    >
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Collection</span>
          </h1>
          <p class="mt-3 text-sm md:text-lg text-slate-500 max-w-xl">
            Explore our latest arrivals and premium products designed strictly for quality.
          </p>
        </div>
        
        <!-- Optional View All Link -->
        <router-link to="/products" class="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700 group">
          View all products
          <svg class="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </router-link>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        <div
          v-for="n in 8"
          :key="n"
          class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse h-80"
        >
          <div class="w-full h-48 rounded-xl bg-slate-200 mb-4"></div>
          <div class="h-4 w-3/4 rounded bg-slate-200 mb-2"></div>
          <div class="h-4 w-1/2 rounded bg-slate-200"></div>
        </div>
      </div>

      <!-- Product Grid -->
      <transition-group
        v-else
        tag="div"
        name="list-fade"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
      >
        <ProductCard
          v-for="product in nonPromotedProducts"
          :key="product._id"
          :product="product"
        />
      </transition-group>

      <!-- Empty State -->
      <div
        v-if="!loading && nonPromotedProducts.length === 0"
        class="flex flex-col items-center justify-center py-20 text-slate-400"
      >
        <div class="p-6 rounded-full bg-white shadow-sm mb-4">
          <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4m16 0-4-4m4 4-4 4"></path>
          </svg>
        </div>
        <p class="text-lg font-medium text-slate-600">No products found right now.</p>
        <p class="text-sm">Please check back later.</p>
      </div>

      <!-- Mobile View All Button -->
      <div class="mt-8 md:hidden text-center">
        <router-link to="/products" class="inline-flex items-center justify-center w-full px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
          View All Collection
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useFavouriteStore } from "@/store/useFavouriteStore";
import { useIntersectionObserver } from "@vueuse/core";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const favouriteStore = useFavouriteStore();

const loading = ref(true);
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
    await favouriteStore.fetchFavourites();
    await Promise.all([productStore.fetchProducts(), categoryStore.fetchCategories()]);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    loading.value = false;
  }
});

const nonPromotedProducts = computed(() =>
  productStore.products.filter((p) => !(p.promotions && p.promotions.length > 0))
);
</script>

<style scoped>
/* Staggered Animation for Grid Items */
.list-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.list-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-fade-leave-active {
  transition: all 0.3s ease;
  position: absolute; 
}
.list-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.list-fade-move {
  transition: transform 0.5s ease;
}
</style>