<template>
  <div class="min-h-screen relative">

    <!-- Navigation / Header -->
    <div class="relative sticky top-0 z-30 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        <!-- Back Button (Styled) -->
        <button
          @click="$router.back()"
          class="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition-all"
          title="Go Back"
        >
          <svg class="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Page Title -->
        <h1 class="text-lg sm:text-2xl font-bold text-slate-800 capitalize truncate max-w-[200px] sm:max-w-md text-center">
          {{ categoryName }}
        </h1>
        
        <!-- Empty Div to balance flex (keeps title centered) -->
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Description / Hero Text -->
      <div v-if="!loading && currentCategory" class="text-center mb-10">
        <p class="text-slate-500 max-w-2xl mx-auto">
          Browse our exclusive collection of <span class="font-semibold text-blue-600">{{ categoryName }}</span>.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        <div v-for="n in 8" :key="n" class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm h-80 animate-pulse">
           <div class="w-full h-48 rounded-xl bg-slate-200 mb-4"></div>
           <div class="h-4 w-3/4 rounded bg-slate-200 mb-2"></div>
           <div class="h-4 w-1/2 rounded bg-slate-200"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div 
        v-else-if="filteredProducts.length" 
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 12H4m16 0-4-4m4 4-4 4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900">No Products Found</h3>
        <p class="text-slate-500 mt-2">We couldn't find any items in this category.</p>
        <router-link to="/" class="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
          Go Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import ProductCard from "@/components/ProductCard.vue";

const route = useRoute();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const loading = ref(true);

const slugify = (text) => text?.toLowerCase().replace(/\s+/g, "-") || "";

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([categoryStore.fetchCategories(), productStore.fetchProducts()]);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});


// 1. Find the current category object based on the URL Slug
const currentCategory = computed(() => {
  const slug = route.params.name;
  return categoryStore.categories.find(
    (c) => slugify(c.name) === slug
  );
});

// 2. Filter products safely (Handling MongoDB _id and String/Number mismatch)
const filteredProducts = computed(() => {
  const category = currentCategory.value;
  if (!category) return [];

  return productStore.products.filter((p) => {
    // Product's category ID
    const productCatId = typeof p.category_id === 'object'
      ? (p.category_id._id || p.category_id.id)
      : p.category_id;

    // Category ID from store
    const categoryId = category.id;

    // Compare as strings
    return String(productCatId) === String(categoryId);
  });
});



const categoryName = computed(() => currentCategory.value?.name || "Category");
</script>