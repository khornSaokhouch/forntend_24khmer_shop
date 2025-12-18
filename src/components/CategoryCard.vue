<template>
  <router-link
    :to="`/category/${slugify(category.name)}`"
    class="group flex flex-col items-center flex-shrink-0 w-24 sm:w-28 md:w-32 cursor-pointer"
  >
    <!-- Image Container with Gradient Ring Effect -->
    <div class="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
      <!-- Gradient Ring (Visible on Hover) -->
      <div 
        class="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]"
      ></div>
      
      <!-- White border separation -->
      <div class="absolute inset-0 rounded-full bg-white p-[3px] shadow-sm group-hover:shadow-md transition-all duration-300">
        <!-- The Image -->
        <div class="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
          <img
            v-if="categoryImage"
            :src="categoryImage"
            :alt="category.name"
            class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <!-- Fallback Initial -->
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 font-bold text-2xl"
          >
            {{ category.name?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Category Name -->
    <h3
      class="mt-3 text-center text-xs sm:text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 px-1"
    >
      {{ category.name }}
    </h3>

    <!-- Optional Count Badge -->
    <span
      v-if="category.item_count !== undefined"
      class="mt-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"
    >
      {{ category.item_count }}
    </span>
  </router-link>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  category: Object,
  API_URL: String
});

const categoryImage = computed(() => {
  const img = props.category?.image;
  if (!img) return null;
  return img.startsWith("http") ? img : `${props.API_URL}/${img}`;
});

const slugify = (text) => text?.toLowerCase().replace(/\s+/g, "-") || "";
</script>