<template>
  <footer class="relative bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-t border-white/20 shadow-inner overflow-hidden">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Main Footer Content -->
      <div class="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Brand & Newsletter Section -->
        <div class="lg:col-span-5">
          <div class="flex items-center space-x-3 group">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                <span class="text-white font-bold text-lg">S</span>
              </div>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Shopping Store</span>
          </div>
          
          <p class="mt-4 text-slate-600 max-w-md leading-relaxed text-sm">
            Your one-stop shop for quality products delivered with exceptional service.
          </p>
          
          <!-- Newsletter Form -->
          <div class="mt-8 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-indigo-500/30 transition-all duration-300">
            <h3 class="text-base font-semibold text-slate-800 mb-1 flex items-center">
              <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              Newsletter
            </h3>
            <p class="text-xs text-slate-500 mb-4">Get weekly updates and deals.</p>
            
            <form class="space-y-3">
              <input 
                type="email" 
                required 
                class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 text-sm" 
                placeholder="Enter your email"
              >
              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <!-- Links Sections -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="group">
            <h3 class="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center">
              <span class="w-6 h-0.5 bg-indigo-500 mr-2 group-hover:w-8 transition-all duration-300"></span>
              Shop
            </h3>
            <ul class="space-y-2">
              <li><a href="#" class="footer-link-fancy">All Products</a></li>
              <li><a href="#" class="footer-link-fancy">Categories</a></li>
              <li><a href="#" class="footer-link-fancy">New Arrivals</a></li>
              <li><a href="#" class="footer-link-fancy">On Sale</a></li>
            </ul>
          </div>
          
          <div class="group">
            <h3 class="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center">
              <span class="w-6 h-0.5 bg-indigo-500 mr-2 group-hover:w-8 transition-all duration-300"></span>
              Company
            </h3>
            <ul class="space-y-2">
              <li><a href="#" class="footer-link-fancy">About Us</a></li>
              <li><a href="#" class="footer-link-fancy">Careers</a></li>
              <li><a href="#" class="footer-link-fancy">Contact</a></li>
              <li><a href="#" class="footer-link-fancy">Support</a></li>
            </ul>
          </div>
          
          <div class="group">
            <h3 class="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center">
              <span class="w-6 h-0.5 bg-indigo-500 mr-2 group-hover:w-8 transition-all duration-300"></span>
              Help
            </h3>
            <ul class="space-y-2">
              <li><a href="#" class="footer-link-fancy">FAQ</a></li>
              <li><a href="#" class="footer-link-fancy">Shipping</a></li>
              <li><a href="#" class="footer-link-fancy">Returns</a></li>
              <li><a href="#" class="footer-link-fancy">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="py-6 border-t border-white/20">
        <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p class="text-xs text-slate-600">
            &copy; {{ new Date().getFullYear() }} Shopping Store. All Rights Reserved.
          </p>
          
          <!-- Social Links -->
          <div class="flex space-x-4">
            <a href="#" class="social-link-fancy">T</a>
            <a href="#" class="social-link-fancy">F</a>
            <a href="#" class="social-link-fancy">I</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer links with hover gradient effect */
.footer-link-fancy {
  @apply text-slate-700 hover:text-indigo-600 transition-all duration-300 relative inline-block text-sm;
}

.footer-link-fancy::before {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300;
}

.footer-link-fancy:hover::before {
  @apply w-full;
}

/* Social links hover effect */
.social-link-fancy {
  @apply w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 text-xs font-semibold;
}
</style>
