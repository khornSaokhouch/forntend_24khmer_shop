<template>
  <router-link
    :to="`/category/${slugify(category.name)}`"
    class="group flex flex-col items-center transition-transform duration-300 hover:scale-105"
  >
    <!-- Circular Image -->
    <div
      class="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-transparent transition-all duration-300 group-hover:border-blue-400 shadow-md"
    >
      <img
        v-if="categoryImage"
        :src="categoryImage"
        :alt="category.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700 text-xl sm:text-2xl font-bold"
      >
        {{ category.name[0]?.toUpperCase() }}
      </div>
    </div>

    <!-- Category Name -->
    <h3
      class="mt-2 text-center text-sm sm:text-base md:text-lg font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600"
    >
      {{ category.name }}
    </h3>

    <!-- Optional Item Count -->
    <span
      v-if="category.item_count !== undefined"
      class="mt-1 text-xs sm:text-sm text-slate-600"
    >
      {{ category.item_count }} items
    </span>
  </router-link>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  category: Object,
});

const categoryImage = computed(() => {
  const img = props.category?.image;

  if (!img) return null;

  // Return full URL if starts with http, otherwise prepend API_URL (for relative paths)
  return img.startsWith("http") ? img : `${props.API_URL}/${img}`;
});

const slugify = (text) => text?.toLowerCase().replace(/\s+/g, "-") || "";
</script>
