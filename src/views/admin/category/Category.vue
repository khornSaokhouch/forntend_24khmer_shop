<template>
  <div>
    <!-- Header: Title -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-800">Category Management</h1>
      <p class="text-slate-500">Add, edit, or remove product categories.</p>
    </div>

    <!-- Add/Edit Form Card -->
    <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg mb-8">
      <h2 class="text-xl font-semibold text-slate-800 mb-6">{{ editCategory ? "Edit Category" : "Add New Category" }}</h2>
      
      <!-- Success/Error Messages -->
      <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">{{ success }}</div>
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium">{{ error }}</div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <!-- Name Input -->
        <div class="md:col-span-1">
          <label for="categoryName" class="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
          <input
            id="categoryName"
            v-model="name"
            type="text"
            placeholder="e.g., Laptops"
            class="w-full py-3 px-4 bg-white/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- File Input & Preview -->
        <div class="md:col-span-1 flex items-end gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Category Image</label>
            <input ref="fileInput" type="file" @change="onFileChange" accept="image/*" class="hidden" />
            <button @click="triggerFileInput" class="flex items-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition">
              <UploadCloud class="w-5 h-5 text-slate-500" />
              <span>Choose Image</span>
            </button>
          </div>
          <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-20 h-20 object-cover rounded-lg border border-slate-200" />
        </div>
        
        <!-- Action Buttons -->
        <div class="md:col-span-1 flex gap-3">
           <button
            @click="submitCategory"
            :disabled="loading"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Save v-if="!loading" class="w-5 h-5" />
            <span>{{ loading ? "Saving..." : editCategory ? "Update" : "Create" }}</span>
          </button>
          <button v-if="editCategory" @click="resetForm" class="px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-if="store.loading" class="text-center py-10"><div class="w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin mx-auto"></div></div>
    <div v-else-if="store.categories.length === 0" class="text-center py-10 text-slate-500">No categories found.</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="category in store.categories"
        :key="category.id"
        class="group bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <img
          v-if="category.category_image"
          :src="`${API_URL}/${category.category_image}`"
          alt="Category Image"
          class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div v-else class="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400">
          <ImageIcon class="w-10 h-10" />
        </div>
        <div class="p-4 flex justify-between items-center">
          <p class="font-bold text-slate-800">{{ category.name }}</p>
          <div class="flex gap-2">
            <button @click="editCategoryFn(category)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors">
              <Edit class="w-5 h-5" />
            </button>
            <button @click="openDeleteModal(category)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeDeleteModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Delete Category</h3>
          <p class="text-slate-600 mb-6">Are you sure you want to delete <strong class="text-slate-800">{{ categoryToDelete?.name }}</strong>? This will also remove it from all associated products.</p>
          <div class="flex space-x-4">
            <button @click="closeDeleteModal" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition">Cancel</button>
            <button @click="handleDeleteCategory" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Edit, Trash2, Save, UploadCloud, ImageIcon } from 'lucide-vue-next';

const store = useCategoryStore();

// Form state
const name = ref("");
const categoryImage = ref(null);
const previewImage = ref("");
const editCategory = ref(null);
const fileInput = ref(null);

// UI state
const loading = ref(false);
const success = ref("");
const error = ref("");
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(null);

const API_URL = import.meta.env.VITE_API_URL;

onMounted(() => {
  store.fetchCategories();
});

const triggerFileInput = () => {
  fileInput.value.click();
};

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    categoryImage.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
}

function resetForm() {
  name.value = "";
  categoryImage.value = null;
  previewImage.value = "";
  editCategory.value = null;
  // Reset the file input value
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

async function submitCategory() {
  if (!name.value.trim()) {
    error.value = "Category name is required";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    if (editCategory.value) {
      await store.updateCategory(editCategory.value.id, name.value, categoryImage.value);
      success.value = "Category updated successfully!";
    } else {
      await store.createCategory(name.value, categoryImage.value);
      success.value = "Category created successfully!";
    }
    resetForm();
  } catch (err) {
    error.value = store.error || "Failed to save category";
  } finally {
    loading.value = false;
    setTimeout(() => { success.value = ""; error.value = "" }, 3000); // Clear messages after 3s
  }
}

function editCategoryFn(category) {
  editCategory.value = category;
  name.value = category.name;
  previewImage.value = category.category_image ? `${API_URL}/${category.category_image}` : "";
  categoryImage.value = null;
  if (fileInput.value) fileInput.value.value = "";
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see the form
}

// Modal handlers
const openDeleteModal = (category) => {
  categoryToDelete.value = category;
  isDeleteModalOpen.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  categoryToDelete.value = null;
};

async function handleDeleteCategory() {
  if (!categoryToDelete.value) return;
  
  try {
    await store.deleteCategory(categoryToDelete.value.id);
    success.value = "Category deleted successfully!";
    setTimeout(() => { success.value = "" }, 3000);
  } catch (err) {
    error.value = store.error || "Failed to delete category";
    setTimeout(() => { error.value = "" }, 3000);
  } finally {
    closeDeleteModal();
  }
}
</script>