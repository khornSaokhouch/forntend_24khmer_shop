<template>
  <div class="min-h-screen flex flex-col">
    <Navbar /> <!-- User Navbar -->

    <main>
      <router-view /> <!-- Loads user pages -->
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>
