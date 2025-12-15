<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Main content -->
    <div class="relative z-10">

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
        class="transition-all duration-700 ease-out delay-200"
        :class="isProductListVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      > 
        <ProductListPage />
      </div>

      <!-- Optional Promotion Section (add if needed) -->
      <div
        ref="promotionSection"
        class="transition-all duration-700 ease-out delay-300"
        :class="isPromotionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <!-- Promotion component goes here if any -->
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import Category from "../components/CategoryList.vue";
import BannerSwiper from "../components/BannerSwiper.vue";
import ProductListPage from "../components/ProductListPage.vue";

// Section refs
const bannerSection = ref(null);
const categorySection = ref(null);
const productListSection = ref(null);
const promotionSection = ref(null);

// Visibility states
const isBannerVisible = ref(false);
const isCategoryVisible = ref(false);
const isProductListVisible = ref(false);
const isPromotionVisible = ref(false);

// Intersection observer helper
const createObserver = (target, isVisible) => {
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true;
        stop(); // stop observing after first visibility
      }
    },
    { threshold: 0.1 }
  );
};

// Apply observers
createObserver(bannerSection, isBannerVisible);
createObserver(categorySection, isCategoryVisible);
createObserver(productListSection, isProductListVisible);
createObserver(promotionSection, isPromotionVisible);
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

.float-animation {
  animation: float 8s ease-in-out infinite;
}
</style>
