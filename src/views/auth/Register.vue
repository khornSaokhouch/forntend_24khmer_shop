<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Enhanced animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-3/4 left-3/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>

    <!-- Floating particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce delay-300"></div>
      <div class="absolute top-40 right-32 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce delay-700"></div>
      <div class="absolute bottom-32 left-40 w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-bounce delay-1000"></div>
    </div>

    <div class="relative w-full max-w-md mx-auto my-4">
      <!-- Enhanced glassmorphism card -->
      <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-blue-500/20 p-6 relative overflow-hidden">
        <!-- Card glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 rounded-3xl"></div>
        
        <!-- Header Section -->
        <div class="text-center mb-6 relative z-10">
          <router-link to="/" class="inline-block mb-4 group">
            <div class="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110">
              <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8"/>
            </div>
          </router-link>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">Create Account</h1>
          <p class="text-blue-100/80 text-sm">Join our community today</p>
        </div>

        <!-- Error Message -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95 -translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-2"
        >
          <div v-if="authStore.error" class="mb-4 p-3 bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl flex items-center backdrop-blur-sm">
            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-xs font-medium">{{ authStore.error }}</span>
          </div>
        </transition>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4 relative z-10">
          <div class="group">
            <label for="name" class="block text-xs font-medium text-blue-100 mb-1 group-focus-within:text-white transition-colors">Full Name</label>
            <div class="relative">
              <input 
                id="name" 
                v-model="name" 
                type="text" 
                placeholder="John Doe" 
                required
                class="w-full py-3 px-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-blue-200/60 backdrop-blur-sm hover:bg-white/15 text-sm"
              />
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          <div class="group">
            <label for="email" class="block text-xs font-medium text-blue-100 mb-1 group-focus-within:text-white transition-colors">Email Address</label>
            <div class="relative">
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                placeholder="you@example.com" 
                required
                class="w-full py-3 px-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-blue-200/60 backdrop-blur-sm hover:bg-white/15 text-sm"
              />
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          <div class="group">
            <label for="password" class="block text-xs font-medium text-blue-100 mb-1 group-focus-within:text-white transition-colors">Password</label>
            <div class="relative">
              <input 
                id="password" 
                v-model="password" 
                :type="isPasswordVisible ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
                class="w-full py-3 px-3 pr-10 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-blue-200/60 backdrop-blur-sm hover:bg-white/15 text-sm"
              />
              <button type="button" @click="isPasswordVisible = !isPasswordVisible" class="absolute inset-y-0 right-0 flex items-center px-3 text-blue-200/60 hover:text-blue-100 transition-colors">
                <Eye v-if="!isPasswordVisible" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          <div class="group">
            <label for="passwordConfirmation" class="block text-xs font-medium text-blue-100 mb-1 group-focus-within:text-white transition-colors">Confirm Password</label>
            <div class="relative">
              <input 
                id="passwordConfirmation" 
                v-model="passwordConfirmation" 
                :type="isConfirmPasswordVisible ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
                class="w-full py-3 px-3 pr-10 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-blue-200/60 backdrop-blur-sm hover:bg-white/15 text-sm"
              />
              <button type="button" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible" class="absolute inset-y-0 right-0 flex items-center px-3 text-blue-200/60 hover:text-blue-100 transition-colors">
                <Eye v-if="!isConfirmPasswordVisible" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center relative overflow-hidden group text-sm"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div v-if="authStore.loading" class="flex items-center relative z-10">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </div>
              <span v-else class="relative z-10">Create Account</span>
            </button>
          </div>
        </form>

        <!-- Footer Link -->
        <div class="mt-4 text-center relative z-10">
          <p class="text-blue-100/80 text-xs">
            Already have an account?
            <router-link to="/login" class="font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-300 transition-all ml-1">
              Sign In
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const handleRegister = async () => {
  await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  });

  if (authStore.user) {
    if (authStore.user.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }
};
</script>