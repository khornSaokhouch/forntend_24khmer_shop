<template>
  <div>
    <!-- Header: Title and Add User Button -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">User Management</h1>
        <p class="text-slate-500">View, add, or manage users in the system.</p>
      </div>
      <button 
        @click="openAddModal"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
      >
        <Plus class="w-5 h-5" />
        <span>Add User</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search class="w-5 h-5 text-slate-400" />
        </div>
        <input 
          v-model="searchTerm"
          type="text"
          placeholder="Search by name or email..."
          class="w-full max-w-sm py-3 pl-12 pr-4 bg-white/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>
    </div>

    <!-- User Table Container -->
    <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="userStore.loading" class="flex justify-center items-center p-20">
        <div class="w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
      </div>
      
      <!-- Table -->
      <table v-else class="w-full">
        <thead class="bg-slate-50/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date Joined</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-4">
                <img v-if="user.profile_image" :src="`${API_URL}/${user.profile_image}`" class="w-10 h-10 rounded-full object-cover"/>
                <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center font-bold text-blue-700 uppercase">{{ user.name[0] }}</div>
                <div>
                  <div class="font-medium text-slate-900">{{ user.name }}</div>
                  <div class="text-sm text-slate-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ formatDate(user.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors">
                <Edit class="w-5 h-5" />
              </button>
              <button @click="openDeleteModal(user)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors ml-2">
                <Trash2 class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal (Placeholder) -->
    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeAddModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-lg w-full mx-auto shadow-2xl">
          <h3 class="text-xl font-semibold text-slate-900 mb-6">Add New User</h3>
          <p class="text-slate-600">Form to add a new user goes here.</p>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="closeAddModal" class="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button>
            <button @click="handleAddUser" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Create User</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute" @click="closeDeleteModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Delete User</h3>
          <p class="text-slate-600 mb-6">Are you sure you want to delete <strong class="text-slate-800">{{ userToDelete?.name }}</strong>? This action cannot be undone.</p>
          <div class="flex space-x-4">
            <button @click="closeDeleteModal" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition">Cancel</button>
            <button @click="handleDeleteUser" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/store/userStore';
import { Plus, Search, Edit, Trash2 } from 'lucide-vue-next';

const API_URL = import.meta.env.VITE_API_URL;
const userStore = useUserStore();

// State for UI
const searchTerm = ref('');
const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);

onMounted(() => {
  userStore.fetchUsers();
});

// Computed property to filter users
const filteredUsers = computed(() => {
  return userStore.users
    // 1. Filter out admin roles
    .filter(user => user.role !== 'admin')
    // 2. Filter by search term
    .filter(user => {
      if (!searchTerm.value) return true;
      const term = searchTerm.value.toLowerCase();
      return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
    });
});

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// Modal handlers
const openAddModal = () => isAddModalOpen.value = true;
const closeAddModal = () => isAddModalOpen.value = false;

const openDeleteModal = (user) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

// Form submission handlers
const handleAddUser = async () => {
  // Replace with your actual add user logic
  alert('Adding new user...');
  // await userStore.addUser(formData);
  closeAddModal();
};

const handleDeleteUser = async () => {
  if (userToDelete.value) {
    try {
      await userStore.deleteUser(userToDelete.value.id);
      // Optionally show a success notification
    } catch (error) {
      // Optionally show an error notification
      console.error("Failed to delete user:", error);
    } finally {
      closeDeleteModal();
    }
  }
};
</script>