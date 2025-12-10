<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Categories</h1>
        <p class="text-sm text-slate-500">Manage your product categories.</p>
      </div>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span v-if="editCategory" class="flex items-center gap-2 text-indigo-600">
            <Edit2 class="w-5 h-5" /> Editing: "{{ editCategory.name }}"
          </span>
          <span v-else>Add New Category</span>
        </h2>
        <button v-if="editCategory" @click="resetForm" class="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors">
          Cancel & Clear
        </button>
      </div>

      <!-- Alerts -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
        <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2">
          <CheckCircle class="w-5 h-5" /> {{ success }}
        </div>
      </transition>
      
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle class="w-5 h-5" /> {{ error }}
        </div>
      </transition>

      <form @submit.prevent="submitCategory" class="flex flex-col md:flex-row gap-6 items-start">
        
        <!-- Image Upload -->
        <div class="flex-shrink-0">
          <div 
            @click="triggerFileInput"
            class="relative w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group bg-slate-50"
          >
            <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
            <div v-else class="flex flex-col items-center text-slate-400 group-hover:text-indigo-500">
              <UploadCloud class="w-6 h-6" />
            </div>
          </div>
          <input ref="fileInput" type="file" @change="onFileChange" accept="image/*" class="hidden" />
        </div>

        <!-- Inputs -->
        <div class="flex-1 w-full flex flex-col md:flex-row gap-4 items-end">
          <div class="w-full">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Category Name</label>
            <input
              v-model="name"
              type="text"
              placeholder="e.g. Electronics"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap h-[46px]"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span>{{ editCategory ? "Update" : "Add Category" }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- CATEGORY LIST -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      
      <!-- Loading State -->
      <div v-if="store.loading && !store.categories.length" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-indigo-600 animate-spin" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!store.categories.length" class="text-center py-12">
        <FolderOpen class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-slate-900 font-medium">No categories yet</h3>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Image</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">ID</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="category in store.categories" 
              :key="category.id"
              class="group hover:bg-slate-50/80 transition-colors"
              :class="{'bg-indigo-50/50': editCategory?.id === category.id}"
            >
              <!-- Image Column -->
              <td class="px-6 py-3">
                <div class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                  <img
                    v-if="category.image"
                    :src="getImageUrl(category.image)"
                    class="w-full h-full object-cover"
                    alt="icon"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon class="w-6 h-6" />
                  </div>
                </div>
              </td>

              <!-- Name Column -->
              <td class="px-6 py-3">
                <div class="font-bold text-slate-800">{{ category.name }}</div>
              </td>

              <!-- ID Column -->
              <td class="px-6 py-3 hidden sm:table-cell">
                <span class="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{{ category.id.substring(0, 8) }}...</span>
              </td>

              <!-- Actions Column -->
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="editCategoryFn(category)"
                    class="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button 
                    @click="openDeleteModal(category)"
                    class="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeDeleteModal"></div>
        <div class="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
          <div class="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 class="w-7 h-7" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">Delete Category?</h3>
          <p class="text-sm text-slate-500 mb-6">
            Are you sure you want to delete <span class="font-bold text-slate-800">"{{ categoryToDelete?.name }}"</span>?
          </p>
          <div class="flex gap-3">
            <button @click="closeDeleteModal" class="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button @click="handleDeleteCategory" class="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCategoryStore } from "@/store/useCategoryStore";
import { 
  Edit2, Trash2, UploadCloud, ImageIcon, 
  CheckCircle, AlertCircle, Loader2, FolderOpen
} from 'lucide-vue-next';

const store = useCategoryStore();
const API_URL = import.meta.env.VITE_API_URL;

// Form State
const name = ref("");
const categoryImage = ref(null);
const previewImage = ref("");
const editCategory = ref(null);
const fileInput = ref(null);

// UI State
const loading = ref(false);
const success = ref("");
const error = ref("");
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(null);

onMounted(() => {
  store.fetchCategories();
});

// --- Helpers ---
const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${API_URL}/${path}`) : '';

const triggerFileInput = () => fileInput.value.click();

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    categoryImage.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const resetForm = () => {
  name.value = "";
  categoryImage.value = null;
  previewImage.value = "";
  editCategory.value = null;
  if (fileInput.value) fileInput.value.value = "";
  error.value = "";
  success.value = "";
};

const showMessage = (type, msg) => {
  if (type === 'success') success.value = msg;
  if (type === 'error') error.value = msg;
  setTimeout(() => { success.value = ""; error.value = ""; }, 3000);
};

// --- Actions ---
const submitCategory = async () => {
  if (!name.value.trim()) return showMessage('error', "Category name is required");

  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    if (editCategory.value) {
      await store.updateCategory(editCategory.value.id, name.value, categoryImage.value);
      showMessage('success', "Category updated successfully!");
    } else {
      await store.createCategory(name.value, categoryImage.value);
      showMessage('success', "Category created successfully!");
    }
    resetForm();
  } catch (err) {
    showMessage('error', store.error || "Failed to save category");
  } finally {
    loading.value = false;
  }
};

const editCategoryFn = (category) => {
  editCategory.value = category;
  name.value = category.name;
  previewImage.value = getImageUrl(category.image);
  categoryImage.value = null;
  if (fileInput.value) fileInput.value.value = "";
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- Delete Modal ---
const openDeleteModal = (category) => {
  categoryToDelete.value = category;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  setTimeout(() => { categoryToDelete.value = null; }, 200);
};

const handleDeleteCategory = async () => {
  if (!categoryToDelete.value) return;
  try {
    await store.deleteCategory(categoryToDelete.value.id);
    showMessage('success', "Category deleted successfully!");
  } catch (err) {
    showMessage('error', store.error || "Failed to delete category");
  } finally {
    closeDeleteModal();
  }
};
</script>
