<template>
  <div class="min-h-screen flex flex-col bg-white font-sans text-slate-800">
    <!-- Navbar Component -->
    <Navbar />

    <!-- 
      MAIN CONTENT WRAPPER 
      pt-16 md:pt-20: Pushes content down so it doesn't hide behind fixed Top Nav
      pb-20 md:pb-0: Pushes content up on mobile so it doesn't hide behind Bottom Nav
    -->
    <main class="flex-grow pt-16 md:pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div class="w-full max-w-7xl mx-auto">
        <!-- Route transition for smooth page switching -->
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition ease-out duration-200" 
            enter-from-class="opacity-0 translate-y-2" 
            enter-to-class="opacity-100 translate-y-0" 
            leave-active-class="transition ease-in duration-150" 
            leave-from-class="opacity-100 translate-y-0" 
            leave-to-class="opacity-0 -translate-y-2"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Footer is hidden on very small screens if you want a true "App" feel, 
         but usually kept for SEO/Links. -->
    <Footer class="mb-[calc(4rem+env(safe-area-inset-bottom))] md:mb-0" />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>