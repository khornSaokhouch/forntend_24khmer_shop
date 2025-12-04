<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          Get In Touch
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16">
          <!-- Contact Form -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-blue-100 shadow-lg shadow-blue-500/5">
            <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Send us a message</h2>
            
            <form class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm">
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea rows="6" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"></textarea>
              </div>
              
              <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-500/25">
                Send Message
              </button>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 shadow-lg shadow-blue-500/5">
              <h3 class="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
              
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-slate-900">Address</h4>
                    <p class="text-slate-600">123 Business Street<br>City, State 12345</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-slate-900">Phone</h4>
                    <p class="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-slate-900">Email</h4>
                    <p class="text-slate-600">hello@company.com</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Hours -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 shadow-lg shadow-blue-500/5">
              <h3 class="text-xl font-bold text-slate-900 mb-6">Business Hours</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-slate-600">Monday - Friday</span>
                  <span class="font-semibold text-slate-900">9:00 AM - 6:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Saturday</span>
                  <span class="font-semibold text-slate-900">10:00 AM - 4:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Sunday</span>
                  <span class="font-semibold text-slate-900">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Your routing and form handling logic would be preserved here
</script>