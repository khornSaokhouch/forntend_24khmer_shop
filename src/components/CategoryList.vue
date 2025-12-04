<template>
  <!-- Main container - This still controls the overall visibility of the section -->
  <div 
    ref="sectionTarget"
    class="py-16 sm:py-20 transition-opacity duration-1000 ease-out"
    :class="isSectionVisible ? 'opacity-100' : 'opacity-0'"
  >
    <div class="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center mb-12 lg:mb-16">
        <!-- 
          [ANIMATION] Header Text Animation
          - Added transition and delay classes.
          - Animates scale and opacity when isSectionVisible becomes true.
        -->
        <h2 
          class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent sm:text-6xl transition-all duration-700 ease-out"
          :class="isSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
        >
          Shop by Category
        </h2>
        <!-- 
          [ANIMATION] Paragraph Animation
          - Added a longer delay to appear after the header.
          - Animates opacity and position when isSectionVisible becomes true.
        -->
        <p 
          class="mt-4 md:mt-6 text-lg text-slate-600 max-w-2xl mx-auto transition-all duration-700 ease-out delay-200"
          :class="isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        >
          Explore our hand-picked collections and find your favorite products.
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="flex space-x-4 overflow-x-auto -mx-4 px-4 py-4">
        <div v-for="n in 6" :key="n" class="w-28 h-28 rounded-full bg-slate-200 animate-pulse flex-shrink-0"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 px-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/10">
        <!-- ... error content ... -->
      </div>

      <!-- Categories Row -->
      <div v-else-if="categories.length" class="overflow-x-auto py-4 -mx-4 px-4">
        <div class="flex space-x-4">
          <!-- 
            [ANIMATION] Staggered Card Animation
            - We pass transition classes directly to the CategoryCard component.
            - We bind a conditional class for the enter animation (fade-in-up).
            - We use an inline style to apply a dynamic transition-delay for each card,
              creating the staggered "domino" effect.
          -->
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

      <!-- Empty State -->
      <div v-else class="text-center py-16 text-slate-500 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100">
        <!-- ... empty state content ... -->
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

// [ANIMATION] Updated Observer for better performance ("fire once")
const { stop } = useIntersectionObserver(
  sectionTarget,
  ([{ isIntersecting }]) => {
    // When the section comes into view...
    if (isIntersecting) {
      // ...set it to visible...
      isSectionVisible.value = true;
      // ...and stop watching to save resources.
      stop();
    }
  },
  { threshold: 0.15 } // Trigger when 15% of the element is visible
);


onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    await store.fetchCategories();
  } catch (err) {
    error.value = store.error || "Failed to fetch categories. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>