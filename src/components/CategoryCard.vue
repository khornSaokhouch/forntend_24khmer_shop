<template>
  <router-link
    :to="`/category/${slugify(category.name)}`"
    class="group flex flex-col items-center transition-transform duration-300 hover:scale-105"
  >
    <!-- Circular Image -->
    <div
      class="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-transparent transition-all duration-300 group-hover:border-blue-400 shadow-md"
    >
      <img
        v-if="category.category_image"
        :src="`${API_URL}/${category.category_image}`"
        :alt="category.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700 text-3xl font-bold"
      >
        {{ category.name[0]?.toUpperCase() }}
      </div>
    </div>

    <!-- Category Name -->
    <h3
      class="mt-3 text-center text-lg md:text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-600"
    >
      {{ category.name }}
    </h3>

    <!-- Optional Item Count -->
    <span
      v-if="category.item_count !== undefined"
      class="mt-1 text-sm text-slate-500"
    >
      {{ category.item_count }} items
    </span>
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  category: {
    type: Object,
    required: true,
    validator: (value) => "id" in value && "name" in value,
  },
  API_URL: {
    type: String,
    required: true,
  },
});

function slugify(text) {
  if (!text) return "";
  return text.toString().toLowerCase().replace(/\s+/g, "-");
}
</script>
