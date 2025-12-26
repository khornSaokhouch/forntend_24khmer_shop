<template>
  <div class="relative min-h-screen overflow-x-hidden">
    

    <!-- Main Content -->
    <main class="relative z-10 flex flex-col gap-12 md:gap-20 ">

      <!-- Banner Section -->
      <section
        ref="bannerSection"
        class="transition-all duration-1000 ease-out transform"
        :class="isBannerVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'"
      >
        <BannerSwiper />
      </section>

      <!-- Category Section -->
      <section
        ref="categorySection"
        class="transition-all duration-1000 ease-out delay-100 transform"
        :class="isCategoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <CategoryList />
      </section>

      <!-- Product List Section -->
      <section
        ref="productListSection"
        class="transition-all duration-1000 ease-out delay-200 transform"
        :class="isProductListVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      > 
        <ProductListPage />
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
// Ensure these paths match your actual folder structure
import CategoryList from "@/components/CategoryList.vue"; // Assuming this is the scrolling list component
import BannerSwiper from "@/components/BannerSwiper.vue";
import ProductListPage from "@/components/ProductListPage.vue"; // Assuming this is your product grid

// Section refs
const bannerSection = ref(null);
const categorySection = ref(null);
const productListSection = ref(null);

// Visibility states
const isBannerVisible = ref(false);
const isCategoryVisible = ref(false);
const isProductListVisible = ref(false);

// Intersection observer helper
const createObserver = (target, isVisible) => {
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true;
        stop(); // Only animate once
      }
    },
    { threshold: 0.1 } // Trigger when 10% visible
  );
};

// Apply observers
createObserver(bannerSection, isBannerVisible);
createObserver(categorySection, isCategoryVisible);
createObserver(productListSection, isProductListVisible);
</script>