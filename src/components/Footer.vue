<template>
  <footer class="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Top Section: Brand & Newsletter -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
        
        <!-- Brand Info -->
        <div class="lg:col-span-4 space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              M
            </div>
            <span class="text-xl font-bold text-slate-900">MiniStore</span>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed">
            Experience the magic of modern shopping. Quality products, fast delivery, and premium support right in your pocket.
          </p>
          
          <!-- Socials -->
          <div class="flex space-x-4 pt-2">
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-all">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-pink-600 hover:border-pink-600 transition-all">
              <Instagram class="w-4 h-4" />
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-sky-500 hover:border-sky-500 transition-all">
              <Twitter class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h3 class="font-semibold text-slate-900 mb-4">Shop</h3>
            <ul class="space-y-3 text-sm">
              <li><router-link to="/products" class="text-slate-500 hover:text-indigo-600 transition-colors">New Arrivals</router-link></li>
              <li><router-link to="/categories" class="text-slate-500 hover:text-indigo-600 transition-colors">Categories</router-link></li>
              <li><router-link to="/favorites" class="text-slate-500 hover:text-indigo-600 transition-colors">Favorites</router-link></li>
              <li><router-link to="/products" class="text-slate-500 hover:text-indigo-600 transition-colors">Sale</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 mb-4">Support</h3>
            <ul class="space-y-3 text-sm">
              <li><a href="#" class="text-slate-500 hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" class="text-slate-500 hover:text-indigo-600 transition-colors">Shipping</a></li>
              <li><a href="#" class="text-slate-500 hover:text-indigo-600 transition-colors">Returns</a></li>
              <li><a href="#" class="text-slate-500 hover:text-indigo-600 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div class="hidden sm:block">
            <h3 class="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul class="space-y-3 text-sm">
              <li><a href="#" class="text-slate-500 hover:text-indigo-600 transition-colors">Privacy</a></li>
              <li><a href="#" class="text-slate-500 hover:text-indigo-600 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="lg:col-span-3">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-2">Get 10% Off</h3>
            <p class="text-xs text-slate-500 mb-4">Subscribe to our newsletter and get a discount on your first order.</p>
            <form class="space-y-2">
              <div class="relative">
                <Mail class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="Your email" 
                  class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <button class="w-full bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-xl transition-colors shadow-lg shadow-slate-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-slate-500">
          &copy; {{ new Date().getFullYear() }} MiniStore Inc. All rights reserved.
        </p>
        
        <!-- Payment Icons (Mockup) -->
        <div class="flex items-center space-x-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div class="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">VISA</div>
          <div class="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">MC</div>
          <div class="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">PAY</div>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Twitter, Mail } from 'lucide-vue-next';
</script>