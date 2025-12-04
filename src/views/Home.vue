<template>
  <div class="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
    <!-- 
      Decorative Floating Shapes 
      [ANIMATION] Added the `float-animation` class you defined to make the background elements move.
    -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 float-animation" style="animation-delay: 0s;"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 float-animation" style="animation-delay: 2s;"></div>
    <div class="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 float-animation" style="animation-delay: 4s;"></div>

    <!-- Main content -->
    <div class="relative z-10 px-4">
      <!-- 
        [ANIMATION] Each component is wrapped in a div that has:
        1. A `ref` to be observed (e.g., `ref="bannerSection"`).
        2. Transition classes (`transition-all...`).
        3. Conditional classes for the visible/hidden state.
      -->
      
      <!-- Banner Section -->
      <div 
        ref="bannerSection"
        class="transition-all duration-700 ease-out"
        :class="isBannerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <BannerSwiper />
      </div>

      <!-- Category Section -->
      <div 
        ref="categorySection"
        class="transition-all duration-700 ease-out delay-100"
        :class="isCategoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <Category />
      </div>

      <!-- Product List Section -->
      <div 
        ref="productListSection"
        class="transition-all duration-700 ease-out delay-100"
        :class="isProductListVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <ProductListPage />
      </div>

      <!-- Promotion Section -->
      <div 
        ref="promotionSection"
        class="py-16 transition-all duration-700 ease-out delay-100"
        :class="isPromotionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <ProductPromotion />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import Category from "../components/CategoryList.vue"; 
import BannerSwiper from "../components/BannerSwiper.vue";
import ProductListPage from "../components/ProductListPage.vue";
import ProductPromotion from "../components/ProductPromotion.vue";

// [ANIMATION] Create refs for each section we want to animate
const bannerSection = ref(null);
const categorySection = ref(null);
const productListSection = ref(null);
const promotionSection = ref(null);

// [ANIMATION] Create visibility state refs for each section
const isBannerVisible = ref(false);
const isCategoryVisible = ref(false);
const isProductListVisible = ref(false);
const isPromotionVisible = ref(false);

/**
 * [ANIMATION] Helper function to create an observer.
 * It watches a target element and updates its visibility ref.
 * It animates only ONCE by calling `stop()` after the element is visible.
 * @param {import('vue').Ref<Element | null>} target - The ref attached to the element to watch.
 * @param {import('vue').Ref<boolean>} isVisible - The ref to update with visibility state.
 */
const createObserver = (target, isVisible) => {
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true;
        stop(); // Stop observing after it becomes visible to improve performance
      }
    },
    { threshold: 0.1 } // Trigger when 10% of the element is in view
  );
};

// [ANIMATION] Apply the observer to each section
createObserver(bannerSection, isBannerVisible);
createObserver(categorySection, isCategoryVisible);
createObserver(productListSection, isProductListVisible);
createObserver(promotionSection, isPromotionVisible);

</script>

<style scoped>
/* This keyframe animation will make elements gently float up and down */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

.float-animation {
  /* Applying your animation to the class */
  animation: float 8s ease-in-out infinite;
}
</style>