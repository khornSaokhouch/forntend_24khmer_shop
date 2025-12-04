<template>
  <div>
    <!-- Header: Title and Add Product Button -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Product Management</h1>
        <p class="text-slate-500">Add, edit, or remove products from your store.</p>
      </div>
      <button 
        @click="openAddModal"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
      >
        <Plus class="w-5 h-5" />
        <span>Add Product</span>
      </button>
    </div>

    <!-- Product Table Container -->
    <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg overflow-hidden">
      <div v-if="productStore.loading" class="p-20 text-center text-slate-500">Loading products...</div>
      <table v-else class="w-full">
        <thead class="bg-slate-50/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="product in productStore.products" :key="product.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <img :src="product.product_image ? `${API_URL}/${product.product_image}` : '/placeholder.png'" class="w-12 h-12 object-cover rounded-lg flex-shrink-0"/>
                <div>
                  <div class="font-medium text-slate-900 line-clamp-2">{{ product.product_name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-700">{{ categoryStore.categories.find(c => c.id === product.category_id)?.name || "N/A" }}</td>
            <td class="px-6 py-4">
              <span class="font-semibold" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">{{ product.stock }}</span>
            </td>
           <td class="px-6 py-4 font-semibold text-slate-800">
  ${{ Number(product.price ?? 0).toFixed(2) }}
</td>

            <td class="px-6 py-4 text-right">
              <button @click="openEditModal(product)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"><Edit class="w-5 h-5" /></button>
              <button @click="openDeleteModal(product)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors ml-2"><Trash2 class="w-5 h-5" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute" @click="closeModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-2xl w-full mx-auto shadow-2xl">
          <h3 class="text-xl font-semibold text-slate-900 mb-6">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input v-model="form.product_name" required class="w-full input-style" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select v-model="form.category_id" required class="w-full input-style"><option value="" disabled>Select Category</option><option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option></select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                <input v-model="form.stock" type="number" required class="w-full input-style" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Price</label>
                <input v-model="form.price" type="number" step="0.01" required class="w-full input-style" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea v-model="form.description" rows="3" class="w-full input-style"></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <input type="file" @change="onFileSelect" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button>
              <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">{{ isEditing ? 'Update Product' : 'Create Product' }}</button>
            </div>
          </form>
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
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"><Trash2 class="w-8 h-8 text-red-500" /></div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Delete Product</h3>
          <p class="text-slate-600 mb-6">Are you sure you want to delete <strong class="text-slate-800">{{ productToDelete?.product_name }}</strong>?</p>
          <div class="flex space-x-4">
            <button @click="closeDeleteModal" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition">Cancel</button>
            <button @click="handleDelete" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { Plus, Edit, Trash2 } from 'lucide-vue-next';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const API_URL = import.meta.env.VITE_API_URL;

const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const productToDelete = ref(null);
const form = ref({});
const file = ref(null);

onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});

const onFileSelect = (e) => { file.value = e.target.files[0]; };

const resetForm = () => {
  form.value = { product_name: "", category_id: "", stock: 0, price: 0.0, description: "" };
  file.value = null;
  isEditing.value = false;
};

const openAddModal = () => {
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (product) => {
  resetForm();
  isEditing.value = true;
  form.value = { ...product };
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const openDeleteModal = (product) => {
  productToDelete.value = product;
  isDeleteModalOpen.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  productToDelete.value = null;
};

const handleSubmit = async () => {
  form.value.stock = Number(form.value.stock);
  form.value.price = parseFloat(form.value.price);

  if (isEditing.value) {
    await productStore.updateProduct(form.value.id, form.value, file.value);
  } else {
    await productStore.createProduct(form.value, file.value);
  }
  closeModal();
};

const handleDelete = async () => {
  if (productToDelete.value) {
    await productStore.deleteProduct(productToDelete.value.id);
    closeDeleteModal();
  }
};
</script>

<style>
.input-style {
  @apply w-full py-3 px-4 bg-white/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>