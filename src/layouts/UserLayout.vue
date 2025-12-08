<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-800 relative selection:bg-indigo-100 selection:text-indigo-700">
    
    <!-- Background Texture (Optional subtle dot pattern) -->
    <div class="fixed inset-0 z-0 opacity-[0.4] pointer-events-none" 
         style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px;">
    </div>

    <!-- Navbar Component -->
    <Navbar />

    <!-- 
      MAIN CONTENT WRAPPER 
      z-10 ensures content is above the background pattern
    -->
    <main class="flex-grow pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 relative z-10">
      <div class="w-full max-w-7xl mx-auto">
        
        <!-- Smooth Route Transitions -->
        <router-view v-slot="{ Component }">
          <transition 
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out" 
            enter-from-class="opacity-0 translate-y-4 scale-[0.98]" 
            enter-to-class="opacity-100 translate-y-0 scale-100" 
            leave-active-class="transition-all duration-200 ease-in" 
            leave-from-class="opacity-100 translate-y-0 scale-100" 
            leave-to-class="opacity-0 -translate-y-4 scale-[0.98]"
          >
            <component :is="Component" />
          </transition>
        </router-view>

      </div>
    </main>

    <!-- Desktop Footer -->
    <Footer class="relative z-10 mb-[calc(4rem+env(safe-area-inset-bottom))] md:mb-0" />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>