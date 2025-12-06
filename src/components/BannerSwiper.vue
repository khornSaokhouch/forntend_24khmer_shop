<template>
  <div class="w-full bg-slate-50">
    <!-- Loading Skeleton -->
    <div v-if="eventStore.loading" class="px-4">
      <div
        class="w-full aspect-[4/3] md:aspect-[21/9] bg-white rounded-3xl p-2 shadow-sm border border-slate-100"
      >
        <div
          class="w-full h-full bg-slate-200 rounded-2xl animate-pulse relative overflow-hidden"
        >
          <div
            class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          ></div>
        </div>
      </div>
    </div>

    <!-- Continuous Auto-Swiper (Right-to-Left) -->
    <swiper
      v-else-if="featuredEvents.length > 0"
      :modules="modules"
      :slides-per-view="1.05"
      :space-between="12"
      :loop="true"
      :looped-slides="featuredEvents.length"
      :speed="5000"
      :autoplay="{
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      }"
      :allow-touch-move="false"
      :grab-cursor="false"
      class="w-full pb-8 px-1"
      dir="rtl"
    >
      <swiper-slide
        v-for="event in featuredEvents"
        :key="event._id + '-' + eventIndex(event)"
      >
        <div
          class="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg shadow-indigo-500/10 group bg-white"
        >
          <!-- Event Image -->
          <img
            :src="getEventImage(event.event_image)"
            :alt="event.name"
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2000ms]"
          />

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          ></div>

          <!-- Date Badge: TOP-RIGHT -->
          <div
            class="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-sm text-center min-w-[55px] z-10"
          >
            <div
              class="text-[10px] font-bold text-indigo-500 uppercase tracking-wide"
            >
              {{ getMonth(event.start_date) }}
            </div>
            <div class="text-xl font-black text-slate-800 leading-none">
              {{ getDay(event.start_date) }}
            </div>
          </div>

          <!-- Event Info Panel: BOTTOM-LEFT -->
          <div class="absolute bottom-0 left-0 p-5 md:p-8 z-10 max-w-[300px]">
            <div class="animate-in slide-in-from-bottom-2 fade-in duration-700">
              <span
                class="inline-block py-1 px-2.5 rounded-lg bg-indigo-500/80 backdrop-blur-md text-white text-[10px] font-bold mb-2 border border-white/10 shadow-sm"
              >
                FEATURED
              </span>
              <h2
                class="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md line-clamp-2"
              >
                {{ event.name }}
              </h2>
              <div
                class="flex items-center gap-3 text-slate-100 text-xs md:text-sm font-medium"
              >
                <div
                  class="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg"
                >
                  <Clock class="w-3.5 h-3.5 text-indigo-300" />
                  {{ getTime(event.start_date) }}
                </div>
                <div class="flex items-center gap-1.5 text-indigo-200">
                  <span>Details</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Empty State -->
    <div v-else class="px-4">
      <div
        class="w-full aspect-[2/1] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-slate-400"
      >
        <Calendar class="w-10 h-10 mb-2 opacity-50" />
        <span class="text-sm font-medium">No active events</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useEventStore } from "../store/useEventStore";
import { Clock, ArrowRight, Calendar } from "lucide-vue-next";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const modules = [Autoplay];

// Pinia store
const eventStore = useEventStore();

// Fetch events on mount
onMounted(() => {
  eventStore.fetchEvents();
});

// Featured events (duplicate slides for smooth RTL loop)
const featuredEvents = computed(() => {
  const original = eventStore.events.slice(0, 5);
  return [...original, ...original]; // duplicate for seamless loop
});

// Helpers
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const getEventImage = (path) =>
  path
    ? path.startsWith("http")
      ? path
      : `${API_URL}/${path}`
    : "https://via.placeholder.com/800x600?text=No+Image";
const getMonth = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short" }) : "";
const getDay = (d) => (d ? new Date(d).getDate() : "");
const getTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

// Helper to create unique keys for duplicated slides
const eventIndex = (event) => event._id + Math.random();
</script>

<style>
.swiper-pagination {
  display: none;
}

/* Optional shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.animate-[shimmer_1.5s_infinite] {
  animation: shimmer 1.5s infinite;
}
</style>
