<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4 md:px-8 lg:px-16">
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        <span class="font-medium">Back</span>
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="flex flex-col items-center space-y-4">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
          ></div>
          <p class="text-slate-600 font-medium text-lg">Loading event...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex items-center justify-center h-96 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100"
      >
        <p class="text-slate-700 font-semibold text-lg">{{ error }}</p>
      </div>

      <!-- Event Details -->
      <div v-else class="bg-white rounded-3xl shadow-xl overflow-hidden">
        <!-- Event Image -->
        <div
          class="w-full h-80 md:h-[70vh] bg-cover bg-center relative"
          :style="{
            backgroundImage: event.event_image
              ? `url(${API_URL}/${event.event_image})`
              : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"
          ></div>
        </div>

        <!-- Event Info -->
        <div class="p-6 md:p-12 space-y-6">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
            {{ event.title }}
          </h1>

          <div
            class="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-600"
          >
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span
                >{{ formatDate(event.start_date) }} -
                {{ formatDate(event.end_date) }}</span
              >
            </div>
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a2 2 0 00-2-2h-3v4zm0 0v-4H7v4h10zm-5-8a2 2 0 100-4 2 2 0 000 4zm0 0v4H7v-4h5z"
                ></path>
              </svg>
              <span>{{ event.location || "Online" }}</span>
            </div>
          </div>

          <p class="text-gray-700 text-base md:text-lg leading-relaxed">
            {{ event.description }}
          </p>

          <div class="flex flex-wrap items-center space-x-4">
            <router-link
              :to="`/register`"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
            >
              Register Now
            </router-link>

            <button
              class="px-6 py-3 border border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
              @click="shareEvent"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useEventStore } from "@/store/useEventStore";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const eventStore = useEventStore();

const event = ref(null);
const loading = ref(true);
const error = ref(null);

// Same slugify function used in Swiper
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// Fetch event by slug
const fetchEvent = async () => {
  loading.value = true;
  try {
    const slug = route.params.title; // slug from URL
    // Fetch all events and find matching slug
    const res = await eventStore.fetchEvents(); // fetch all events first
    const matched = eventStore.events.find((e) => slugify(e.title) === slug);
    if (!matched) throw new Error("Event not found");
    event.value = matched;
  } catch (err) {
    error.value = err.message || "Event not found.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

onMounted(fetchEvent);

const shareEvent = () => {
  if (!event.value) return;
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  alert("Event link copied to clipboard!");
};
</script>

<style scoped>
/* Optional: add line-clamp for long descriptions */
</style>
