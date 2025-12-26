<template>
  <div class="w-full pt-4 relative group">
    <!-- 1. Loading State -->
    <div v-if="eventStore.loading" class="px-4 w-full">
      <div
        class="w-full aspect-[4/3] md:aspect-[21/9] bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100"
      >
        <div
          class="w-full h-full bg-slate-100 rounded-[1.5rem] animate-pulse relative overflow-hidden"
        >
          <div
            class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"
          ></div>
        </div>
      </div>
    </div>

    <!-- 2. The Auto-Swiper (Right-to-Left) -->
    <div v-else-if="featuredEvents.length > 0" class="relative">
      <swiper
        :key="featuredEvents.length"
        :modules="modules"
        :slides-per-view="1.05"
        :centered-slides="true"
        :space-between="16"
        :loop="true"
        :looped-slides="featuredEvents.length"
        :speed="5000"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
        }"
        :allow-touch-move="false"
        :pagination="{
          clickable: true,
          dynamicBullets: true,
        }"
        class="w-full px-2 md:px-0"
        dir="rtl"
      >
     <swiper-slide
  v-for="event in featuredEvents"
  :key="event._id"
>
  <!-- Wrap entire card in router-link for navigation -->
  <router-link
    :to="`/events/${slugify(event.name)}`"
    class="relative w-full h-[200px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-900/30 bg-slate-900 isolate group hover:shadow-2xl transition-shadow duration-500 block"
  >
    <!-- Image with hover zoom -->
    <div class="absolute inset-0 overflow-hidden">
      <img
        :src="getEventImage(event.event_image)"
        :alt="event.name"
        class="w-full h-full object-cover transform transition-transform duration-[2000ms] ease-linear group-hover:scale-105"
      />
    </div>

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10"></div>

    <!-- Date Badge -->
    <div class="absolute top-4 right-4 z-20">
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-center shadow-lg">
        <div class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
          {{ getMonth(event.start_date) }}
        </div>
        <div class="text-2xl font-black text-white leading-none tracking-tight">
          {{ getDay(event.start_date) }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="absolute bottom-4 left-4 z-20">
      <div class="flex flex-col items-start gap-2 md:gap-3">
        <span class="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold tracking-wider uppercase shadow-lg shadow-indigo-600/20 border border-white/10">
          Featured
        </span>

        <h2 class="text-lg md:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-lg line-clamp-2">
          {{ event.name }}
        </h2>

        <div class="flex items-center gap-2 md:gap-3 text-indigo-100 text-xs md:text-sm font-medium bg-white/5 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/10 shadow-sm">
          <Clock class="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
          {{ getTime(event.start_date) }}
        </div>
      </div>
    </div>
  </router-link>
</swiper-slide>

      </swiper>
    </div>

    <!-- 3. Empty State -->
    <div v-else class="px-4">
      <div
        class="w-full aspect-[2/1] bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-slate-400"
      >
        <Calendar class="w-12 h-12 mb-3 opacity-30" />
        <span class="text-sm font-medium">No active events</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useEventStore } from "../store/useEventStore";
import { Clock, Calendar } from "lucide-vue-next";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const modules = [Autoplay, Pagination];
const eventStore = useEventStore();

onMounted(() => {
  eventStore.fetchEvents();
});

const featuredEvents = computed(() => eventStore.events.slice(0, 5));

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const slugify = (text) => text?.toLowerCase().replace(/\s+/g, "-") || "";


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
</script>

<style>
.swiper-pagination-bullet {
  background: #94a3b8 !important;
  opacity: 1;
}
.swiper-pagination-bullet-active {
  background: #4f46e5 !important;
  width: 20px;
  border-radius: 10px;
}
</style>
