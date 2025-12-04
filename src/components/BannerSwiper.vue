  <template>
    <div class="w-full relative shadow-xl rounded-2xl py-8">
      <!-- Loading State -->
      <div v-if="eventStore.loading" class="flex items-center justify-center h-[400px]">
        <div class="flex flex-col items-center space-y-6">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p class="text-slate-600 font-medium text-lg">Loading events...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="eventStore.error" class="flex items-center justify-center h-[400px] bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 mx-4">
        <div class="text-center space-y-4">
          <svg class="w-20 h-20 mx-auto text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-slate-700 font-semibold text-lg">{{ eventStore.error }}</p>
          <button @click="eventStore.fetchEvents()" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold">
            Try Again
          </button>
        </div>
      </div>

      <!-- Swiper Slides -->
      <div v-else class="container mx-auto px-4">
        <swiper
          :modules="[Autoplay, Pagination, Navigation, EffectFade]"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :effect="'fade'"
          :fade-effect="{ crossFade: true }"
          :pagination="{ clickable: true }"
          :navigation="{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }"
          class="enhanced-swiper"
        >
          <swiper-slide
            v-for="event in eventStore.events"
            :key="event.id"
            class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden border border-blue-100 w-[90%] mx-auto"
          >
            <div class="flex flex-col md:flex-row items-center h-[450px]">
              
              <!-- Text Section: 40% width -->
              <div class="w-full md:w-2/5 p-6 lg:p-12 order-2 md:order-1 relative h-full flex flex-col justify-center">
                <div class="slide-content relative z-10 space-y-4">
                  <div class="slide-badge inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-200">
                    Upcoming Event
                  </div>
                  <h2 class="slide-title text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                    {{ event.title }}
                  </h2>
                  <p v-if="event.description" class="slide-desc text-slate-600 text-base md:text-lg leading-relaxed line-clamp-3">
                    {{ event.description }}
                  </p>

                  <div class="slide-actions flex items-center space-x-4 pt-2">
                    <router-link
                      :to="`/event/${slugify(event.title)}`"
                      class="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-sm"
                    >
                      <span>Learn More</span>
                      <svg class="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </router-link>

                    <div class="flex items-center space-x-2">
                      <button class="swiper-button-prev-custom nav-button">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </button>
                      <button class="swiper-button-next-custom nav-button">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Image Section: 60% width -->
              <div class="w-full md:w-3/5 h-[300px] md:h-full order-1 md:order-2 relative">
                <div class="w-full h-full rounded-2xl md:rounded-r-3xl md:rounded-l-none bg-cover bg-center shadow-xl relative overflow-hidden"
                    :style="{ backgroundImage: event.event_image ? `url(${API_URL}/${event.event_image})` : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }">
                  <div class="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-blue-900/10"></div>
                  <div class="absolute top-4 right-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
                  <div class="absolute bottom-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
                </div>
              </div>

            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </template>

  <script setup>
  import { onMounted } from "vue";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/pagination";
  import "swiper/css/navigation";
  import "swiper/css/effect-fade";

  import { useEventStore } from "@/store/useEventStore";

  const API_URL = import.meta.env.VITE_API_URL;
  const eventStore = useEventStore();

  // Ensure all hooks are called at the top level
  onMounted(() => {
    eventStore.fetchEvents();
  });

  // Slugify function for URL-safe titles
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-');    // Replace multiple - with single -
  };
  </script>

  <style scoped>
  .enhanced-swiper {
    --swiper-theme-color: #3b82f6;
  }

  .enhanced-swiper :deep(.swiper-pagination) {
    position: static;
    margin-top: 2rem;
    text-align: left;
    padding-left: 4rem;
  }

  @media (max-width: 767px) {
    .enhanced-swiper :deep(.swiper-pagination) {
      padding-left: 2rem;
      margin-top: 1.5rem;
      text-align: center;
    }
  }

  .enhanced-swiper :deep(.swiper-pagination-bullet) {
    width: 12px;
    height: 12px;
    background-color: #cbd5e1;
    opacity: 1;
    transition: all 0.3s ease;
  }

  .enhanced-swiper :deep(.swiper-pagination-bullet-active) {
    width: 32px;
    border-radius: 6px;
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .nav-button {
    @apply w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600;
    @apply hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300;
  }

  .nav-button.swiper-button-disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  .slide-content > * {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .swiper-slide-active .slide-content > * {
    opacity: 1;
    transform: translateY(0);
  }
  .swiper-slide-active .slide-badge { transition-delay: 0.1s; }
  .swiper-slide-active .slide-title { transition-delay: 0.2s; }
  .swiper-slide-active .slide-desc { transition-delay: 0.3s; }
  .swiper-slide-active .slide-actions { transition-delay: 0.4s; }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>
