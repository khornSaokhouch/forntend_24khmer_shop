<template>
  <div 
    ref="sectionTarget"
    class="w-full py-12 bg-white relative"
  >
    <div 
      class="container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000"
      :class="isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
    >
      
      <!-- Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop by <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Category</span>
          </h2>
        </div>
        <!-- Scroll Indicators (Desktop) -->
        <div class="hidden md:flex gap-2">
           <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Scroll to explore</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex space-x-6 overflow-hidden px-2 py-4">
        <div v-for="n in 6" :key="n" class="flex flex-col items-center space-y-3">
          <div class="w-24 h-24 rounded-full bg-slate-100 animate-pulse"></div>
          <div class="w-16 h-3 rounded bg-slate-100 animate-pulse"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 bg-red-50 rounded-xl text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- Categories List -->
      <div v-else-if="categories.length" class="relative group">
        
        <!-- Gradient Masks for Scroll Hinting -->
        <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden"></div>
        <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden"></div>

        <!-- Scroll Container -->
        <div class="flex overflow-x-auto gap-4 sm:gap-8 pb-6 px-1 scrollbar-hide snap-x">
          <CategoryCard
            v-for="(category, index) in categories"
            :key="category._id || category.id"
            :category="category"
            :API_URL="API_URL"
            class="snap-start"
            :style="{ animationDelay: `${index * 100}ms` }"
          />
        </div>
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
  { threshold: 0.2 }
);

onMounted(async () => {
  loading.value = true;
  try {
    await store.fetchCategories();
  } catch (err) {
    error.value = "Unable to load categories";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>