<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          About Our Story
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          We're passionate about creating exceptional experiences and building meaningful connections with our community.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900">Our Mission</h2>
            <p class="text-lg text-slate-600 leading-relaxed">
              We believe in the power of innovation and dedication to transform ideas into reality. Our team is committed to delivering excellence in everything we do.
            </p>
            <p class="text-lg text-slate-600 leading-relaxed">
              Through continuous learning and adaptation, we strive to stay ahead of industry trends and provide cutting-edge solutions that make a real difference.
            </p>
          </div>
          <div class="relative">
            <div class="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-1">
              <div class="w-full h-full rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <div class="text-center space-y-4">
                  <div class="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-slate-900">Innovation First</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 lg:py-24 bg-white/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">
            The principles that guide everything we do and shape our company culture.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-4">Quality</h3>
            <p class="text-slate-600">We never compromise on quality and always strive for excellence in our work.</p>
          </div>
          
          <div class="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-4">Collaboration</h3>
            <p class="text-slate-600">We believe in the power of teamwork and value every team member's contribution.</p>
          </div>
          
          <div class="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-4">Innovation</h3>
            <p class="text-slate-600">We continuously push boundaries and embrace new technologies and ideas.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Your routing and functionality logic would be preserved here
</script>