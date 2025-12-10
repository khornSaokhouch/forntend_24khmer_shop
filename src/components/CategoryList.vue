<template>
  <div 
    ref="sectionTarget"
    class="p-2 transition-opacity duration-1000 ease-out"
    :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
  >
    <div class="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">

      <div class="text-center mb-12 lg:mb-16">
        <h2 
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent transition-all duration-700 ease-out"
          :class="isSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
        >
          Shop by Category
        </h2>

        <p 
          class="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto transition-all duration-700 ease-out delay-200"
          :class="isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        >
          Explore our hand-picked collections and find your favorite products.
        </p>
      </div>

      <div v-if="loading" class="flex space-x-4 overflow-x-auto -mx-4 px-4 py-4">
        <div v-for="n in 6" :key="n" class="w-24 h-24 rounded-full bg-slate-200 animate-pulse flex-shrink-0"></div>
      </div>

      <div v-else-if="error" class="text-center py-12 px-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/10">
        Failed to load categories.
      </div>

      <div v-else-if="categories.length" class="overflow-x-auto px-2 sm:px-4 scrollbar-hide">
        <div class="flex space-x-3 sm:space-x-4">
          <CategoryCard
            v-for="(category, index) in categories"
            :key="category.id"
            :category="category"
            :API_URL="API_URL"
            class="transition-all duration-500 ease-out"
            :class="isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
            :style="{ transitionDelay: `${200 + index * 100}ms` }"
          />
        </div>
      </div>

      <div v-else class="text-center py-16 text-slate-500 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100">
        No categories found.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCategoryStore } from "@/store/useCategoryStore";
import CategoryCard from "@/components/CategoryCard.vue";
import { useIntersectionObserver } from '@vueuse/core';

const store = useCategoryStore();
const error = ref("");
const loading = ref(true);
const API_URL = import.meta.env.VITE_API_URL;
const categories = computed(() => store.categories);

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
  { threshold: 0.15 }
);

onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    await store.fetchCategories();
  } catch {
    error.value = "Failed to fetch categories";
  }
  loading.value = false;
});
</script>
