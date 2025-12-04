<template>
  <div class="p-6 max-w-8xl mx-auto">
    <button
      @click="$router.back()"
      class="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
    >
      ← Back
    </button>

    <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
      {{ categoryName }} Products
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="border rounded-xl shadow-sm p-4 space-y-4">
        <div class="w-full h-48 rounded-lg bg-slate-200 animate-pulse"></div>
        <div class="h-4 w-3/4 rounded bg-slate-200 animate-pulse"></div>
        <div class="h-4 w-1/2 rounded bg-slate-200 animate-pulse"></div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :API_URL="API_URL"
      />
    </div>

    <!-- Empty State -->
    <p v-else class="text-gray-600 text-center py-16">
      No products found for this category.
    </p>
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

const API_URL = import.meta.env.VITE_API_URL;
const loading = ref(true);

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

// Load products and categories
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

// Current category based on slug
const currentCategory = computed(() => {
  return categoryStore.categories.find(
    (c) => slugify(c.name) === route.params.name
  );
});

// Filtered products by category
const filteredProducts = computed(() => {
  if (!currentCategory.value) return [];
  return productStore.products.filter(
    (p) => Number(p.category_id) === Number(currentCategory.value.id)
  );
});

const categoryName = computed(() => currentCategory.value?.name || "Category");
</script>
