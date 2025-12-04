<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-fadeIn">
      <h2 class="text-lg font-semibold text-slate-800 mb-2">Login Required</h2>
      <p class="text-slate-600 mb-4">You need to log in to manage favourites.</p>
      <div class="flex justify-end space-x-2">
        <button
          @click="hide"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
        >
          Cancel
        </button>
        <router-link
          to="/login"
          class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);

// Methods exposed to parent via ref
const show = () => (visible.value = true);
const hide = () => (visible.value = false);

defineExpose({ show, hide });
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
