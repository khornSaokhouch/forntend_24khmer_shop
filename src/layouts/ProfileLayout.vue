<script setup>
import { ref, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import { useAuthStore } from "../store/authStore";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const showLogoutModal = ref(false);

// Confirm logout
const confirmLogout = () => {
  authStore.logout();
  toast.success("You have been logged out!", { position: "top-right" });
  router.push("/login");
  showLogoutModal.value = false;
};

// Check active route
const isActive = (path) => route.path === path;

// Computed full URL for profile image
const userImage = computed(() => {
  const user = authStore.user;
  if (!user?.image) return null;
  return user.image.startsWith("http")
    ? user.image
    : `${import.meta.env.VITE_API_URL}/${user.image}`;
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
    <!-- Decorative background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-40 h-40 bg-blue-200/50 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-56 h-56 bg-cyan-200/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <Navbar />

      <div class="flex flex-1 container mx-auto py-6 gap-6">
        <!-- Sidebar -->
        <aside class="w-72 flex-shrink-0">
          <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 flex flex-col shadow-lg h-full">
            <!-- User info -->
            <div class="mb-8 flex items-center space-x-4">
              <div class="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
                <div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    v-if="userImage"
                    :src="userImage"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <span
                    v-else
                    class="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                  >
                    {{ authStore.user?.name.charAt(0) }}
                  </span>
                </div>
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ authStore.user?.name }}</p>
                <p class="text-slate-600 text-sm capitalize">{{ authStore.user?.role }}</p>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 flex flex-col space-y-2">
              <router-link
                to="/profile"
                :class="[
                  'group flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200',
                  isActive('/profile')
                    ? '!bg-gradient-to-r !from-blue-100 !to-cyan-100 !text-blue-700 font-semibold shadow-inner'
                    : 'text-slate-600 hover:bg-slate-100',
                ]"
              >
                <svg
                  class="w-5 h-5 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5.121 17.804A8 8 0 0112 15a8 8 0 016.879 2.804M12 12a4 4 0 100-8 4 4 0 000 8z"
                  ></path>
                </svg>
                <span>Profile</span>
              </router-link>

              <!-- Add other links as in your current layout (Orders, Payments, etc.) -->
              <!-- Keep all colors, spacing, hover effects exactly the same -->

            </nav>

            <!-- Logout Button -->
            <button
              @click="showLogoutModal = true"
              class="mt-auto flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1">
          <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl min-h-full shadow-lg">
            <router-view />
          </div>
        </main>
      </div>

      <Footer />
    </div>

    <!-- Logout Modal (keep your existing UI) -->
    <transition name="fade-scale">
      <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showLogoutModal = false"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">Confirm Logout</h3>
            <p class="text-slate-600 mb-6">Are you sure you want to sign out?</p>
            <div class="flex space-x-4">
              <button @click="showLogoutModal = false"
                class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition-colors">
                Cancel
              </button>
              <button @click="confirmLogout"
                class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
