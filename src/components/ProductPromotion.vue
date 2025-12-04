<template>
  <!-- [ANIMATION] 1. Add ref and transition classes to the root element. -->
  <div 
    ref="sectionTarget"
    class="px-8 transition-opacity duration-700 ease-out"
    :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
  >
    <!-- Header: Title Center + Category Filter Inline -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 flex-wrap">
      <!-- [ANIMATION] 2. Animate the header title. -->
      <h1 
        class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent transition-all duration-500 ease-out"
        :class="isSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
      >
        Product Promotion
      </h1>

      <!-- [ANIMATION] 3. Animate the category filter bar with a delay. -->
      <div 
        class="flex overflow-x-auto gap-2 py-2 transition-all duration-500 ease-out delay-150"
        :class="isSectionVisible ? 'opacity-100' : 'opacity-0 translate-y-3'"
      >
        <button
          :class="['px-4 py-2 rounded-full font-semibold transition whitespace-nowrap', selectedCategory === null ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          @click="selectedCategory = null"
        >
          All
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['px-4 py-2 rounded-full font-semibold transition whitespace-nowrap', selectedCategory === category.id ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- ... skeleton content ... -->
    </div>

    <!-- Product Grid -->
    <!-- [ANIMATION] 4. Use `v-if="isSectionVisible"` to trigger the appear animation on scroll. -->
    <transition-group
      v-else-if="isSectionVisible && displayedProducts.length > 0"
      tag="div"
      name="list-fade"
      appear
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="(product, index) in displayedProducts"
        :key="product.id"
        :product="product"
        :API_URL="API_URL"
        :style="{ transitionDelay: `${index * 50}ms` }"
      />
    </transition-group>

    <!-- Empty State -->
    <div v-if="!loading && filteredProducts.length === 0" class="text-center py-16">
      <p class="text-slate-500">No products found for this category.</p>
    </div>

    <!-- Show More Button -->
    <!-- [ANIMATION] 5. Animate the button to appear after the grid. -->
    <div 
      v-if="!loading && filteredProducts.length > 8" 
      class="text-center mt-6 transition-opacity duration-500 delay-500"
      :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
    >
      <button
        @click="showMore = !showMore"
        class="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
      >
        {{ showMore ? 'Show Less' : 'Show More' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/store/useProductStore";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import ProductCard from "@/components/ProductCard.vue";
// [ANIMATION] Import the composable from VueUse
import { useIntersectionObserver } from '@vueuse/core';

const productStore = useProductStore();
const promotionStore = usePromotionStore();
const categoryStore = useCategoryStore();
const API_URL = import.meta.env.VITE_API_URL;

const loading = ref(true);
const showMore = ref(false);
const selectedCategory = ref(null);

// [ANIMATION] Setup for the scroll trigger
const sectionTarget = ref(null);
const isSectionVisible = ref(false);

const { stop } = useIntersectionObserver(
  sectionTarget,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isSectionVisible.value = true;
      stop(); // Animate only once
    }
  },
  { threshold: 0.1 } // Trigger when 10% is visible
);

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      categoryStore.fetchCategories(),
      productStore.fetchProducts(),
      promotionStore.fetchPromotions()
    ]);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const categories = computed(() => categoryStore.categories);

const filteredProducts = computed(() => {
  return productStore.products
    .map(product => {
      const promotions = promotionStore.promotions.filter(promo =>
        promo.categories.some(cat => cat.id === product.category_id)
      );
      return { ...product, promotions };
    })
    .filter(product => product.promotions.length > 0)
    .filter(product => selectedCategory.value === null || product.category_id === selectedCategory.value);
});

const displayedProducts = computed(() => {
  return showMore.value ? filteredProducts.value : filteredProducts.value.slice(0, 8);
});
</script>

<style scoped>
/* Updated styles for better leave animation */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.4s ease;
}
/* This is for items moving when others are removed */
.list-fade-move {
  transition: transform 0.4s ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>