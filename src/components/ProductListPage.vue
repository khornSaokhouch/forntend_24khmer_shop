<template>
  <div 
    ref="sectionTarget"
    class="px-8 transition-opacity duration-700 ease-out"
    :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
  >
    
    <!-- Section Header -->
    <div class="text-center mb-10 lg:mb-14">
      <h1 
        class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent sm:text-6xl transition-all duration-700 ease-out"
        :class="isSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
      >
        Products
      </h1>
      <p 
        class="mt-4 md:mt-6 text-lg text-slate-600 max-w-2xl mx-auto transition-all duration-700 ease-out delay-150"
        :class="isSectionVisible ? 'opacity-100' : 'opacity-0 translate-y-4'"
      >
        Browse our collection of products without promotions.
      </p>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="border rounded-xl shadow-sm p-4 space-y-4">
        <div class="w-full h-48 rounded-lg bg-slate-200 animate-pulse"></div>
        <div class="h-4 w-3/4 rounded bg-slate-200 animate-pulse"></div>
        <div class="h-4 w-1/2 rounded bg-slate-200 animate-pulse"></div>
      </div>
    </div>

    <!-- Product Grid -->
    <transition-group
      v-else-if="isSectionVisible && nonPromotedProducts.length > 0"
      tag="div"
      name="list-fade"
      appear
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="(product, index) in nonPromotedProducts"
        :key="product.id"
        :product="product"
        :API_URL="API_URL"
        :style="{ transitionDelay: `${index * 50}ms` }"
      />
    </transition-group>

    <!-- Empty State -->
    <div v-if="!loading && nonPromotedProducts.length === 0" 
         class="text-center py-16 transition-opacity duration-500"
         :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div class="w-16 h-16 mx-auto mb-4 text-blue-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-16 h-16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <p class="text-lg text-slate-500">No products found without promotions.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import ProductCard from "@/components/ProductCard.vue";
import { useIntersectionObserver } from '@vueuse/core';

// Stores
const productStore = useProductStore();
const categoryStore = useCategoryStore();

// State
const loading = ref(true);
const API_URL = import.meta.env.VITE_API_URL;

// Intersection Observer for fade-in
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

// Fetch products and categories
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      productStore.fetchProducts(),
      categoryStore.fetchCategories()
    ]);
    console.log("Fetched products:", productStore.products);
    console.log("Non-promoted products:", nonPromotedProducts.value);
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
.list-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.list-fade-enter-active {
  transition: all 0.5s ease-out;
}
</style>
