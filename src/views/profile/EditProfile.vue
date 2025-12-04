<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-2">
        <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          My Profile
        </span>
      </h1>
      <p class="text-slate-600">
        Update your personal information below.
      </p>
    </div>

    <!-- Loading Spinner -->
    <div v-if="!authStore.user" class="flex justify-center items-center py-20">
      <div class="w-16 h-16 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
    </div>

    <!-- Profile Card -->
    <div v-else class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-8 shadow-lg w-full max-w-xl">
      <div class="flex flex-col items-center space-y-6">
        <!-- Profile Image -->
        <div class="relative cursor-pointer">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-md">
            <div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img 
                v-if="previewImage" 
                :src="previewImage" 
                alt="Profile" 
                class="w-full h-full object-cover"
                @click="showModal = true"
              />
              <span v-else class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {{ authStore.user.name.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Change image button -->
          <button @click="triggerFileInput" class="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 transition rounded-full flex items-center justify-center shadow-lg text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          <input 
            ref="fileInput"
            type="file" 
            @change="onFileChange"
            class="hidden"
            accept="image/*"
          />
        </div>

        <!-- Name Field -->
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="Enter your full name" 
            class="w-full py-3 px-4 bg-white/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-800 placeholder-slate-400"
          />
        </div>

        <!-- Email (Read-only) -->
        <div class="w-full">
          <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input 
            :value="authStore.user.email"
            type="text" 
            readonly
            class="w-full py-3 px-4 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
          />
        </div>

        <!-- Update Button -->
        <button
          @click="updateProfile"
          :disabled="loading"
          class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Updating...' : 'Update Profile' }}</span>
        </button>
      </div>
    </div>

    <!-- Modal for Image Preview -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl overflow-hidden shadow-lg max-w-md w-full relative">
          <button @click="showModal = false" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-lg font-bold">
            ✕
          </button>
          <img :src="previewImage" alt="Profile Preview" class="w-full h-auto object-cover"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();

const API_URL = import.meta.env.VITE_API_URL;

// Form fields
const name = ref(authStore.user?.name || "");
const profileImage = ref(null);
const loading = ref(false);
const showModal = ref(false);
const fileInput = ref(null);

// Computed preview for image
const previewImage = computed(() => {
  if (profileImage.value) return URL.createObjectURL(profileImage.value);
  if (authStore.user?.profile_image) return `${API_URL}/${authStore.user.profile_image}`;
  return "";
});

// Watch for authStore.user changes to update form fields
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) name.value = newUser.name;
  },
  { immediate: true }
);

// Trigger hidden file input
function triggerFileInput() {
  fileInput.value.click();
}

// Handle file selection
function onFileChange(event) {
  const file = event.target.files[0];
  if (file) profileImage.value = file;
}

// Update profile
async function updateProfile() {
  if (!name.value.trim()) {
    toast.error("Name cannot be empty", { position: "top-right" });
    return;
  }

  loading.value = true;

  try {
    // Update user via store
    const updatedUser = await userStore.updateUser(
      authStore.user.id,
      { name: name.value },
      profileImage.value
    );

    // Update authStore reactively and sessionStorage
    authStore.updateLocalUser(updatedUser);

    // Clear selected file
    profileImage.value = null;

    // Success toast
    toast.success("Profile updated successfully!", { position: "top-right" });
  } catch (err) {
    toast.error(err.response?.data?.detail || "Failed to update profile", { position: "top-right" });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
