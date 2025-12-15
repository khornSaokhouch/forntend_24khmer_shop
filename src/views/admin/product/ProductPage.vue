<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Product Management</h1>
        <p class="text-slate-500">Add, edit, or remove products from your store.</p>
      </div>
      <button @click="openAddModal" class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold">
        <Plus class="w-5 h-5" />
        Add Product
      </button>
    </div>

    <!-- Product Table -->
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
          <tr v-for="product in productStore.products" :key="product._id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <img 
                  :src="product.image_product || '/placeholder.png'" 
                  class="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <div class="font-medium text-slate-900 line-clamp-2">{{ product.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-700">
              {{ categoryStore.categories.find(c => c._id === product.category_id)?._id ? categoryStore.categories.find(c => c._id === product.category_id).name : "N/A" }}
            </td>
            <td class="px-6 py-4">
              <span :class="product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">{{ product.stock }}</span>
            </td>
            <td class="px-6 py-4 font-semibold text-slate-800">${{ Number(product.price).toFixed(2) }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openEditModal(product)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"><Edit class="w-5 h-5" /></button>
              <button @click="openDeleteModal(product)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors ml-2"><Trash2 class="w-5 h-5" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30" @click="closeModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
          <h3 class="text-xl font-semibold text-slate-900 mb-6">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input v-model="form.name" required class="w-full py-3 px-4 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select v-model="form.category_id" required class="w-full py-3 px-4 border border-slate-300 rounded-lg">
                  <option value="" disabled>Select Category</option>
  <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                <input v-model.number="form.stock" type="number" required class="w-full py-3 px-4 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Price</label>
                <input v-model.number="form.price" type="number" step="0.01" required class="w-full py-3 px-4 border border-slate-300 rounded-lg" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea v-model="form.description" rows="3" class="w-full py-3 px-4 border border-slate-300 rounded-lg"></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <input type="file" @change="onFileSelect" class="w-full text-sm text-slate-500" />
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold">Cancel</button>
              <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">{{ isEditing ? 'Update Product' : 'Create Product' }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Modal -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30" @click="closeDeleteModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"><Trash2 class="w-8 h-8 text-red-500" /></div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Delete Product</h3>
          <p class="text-slate-600 mb-6">Are you sure you want to delete <strong class="text-slate-800">{{ productToDelete?.name }}</strong>?</p>
          <div class="flex space-x-4">
            <button @click="closeDeleteModal" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium">Cancel</button>
            <button @click="handleDelete" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium">Delete</button>
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
import { useAuthStore } from "@/store/authStore";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const productToDelete = ref(null);
const form = ref({});
const file = ref(null);

onMounted(() => {
  const userId = authStore.user._id;
  productStore.fetchProductsByUser(userId);
  categoryStore.fetchCategories();
});

const onFileSelect = e => { file.value = e.target.files[0]; };
const resetForm = () => { form.value = { name: "", category_id: "", stock: 0, price: 0, description: "" }; file.value = null; isEditing.value = false; };
const openAddModal = () => { resetForm(); isModalOpen.value = true; };
const openEditModal = product => { resetForm(); isEditing.value = true; form.value = { ...product }; isModalOpen.value = true; };
const closeModal = () => { isModalOpen.value = false; };
const openDeleteModal = product => { productToDelete.value = product; isDeleteModalOpen.value = true; };
const closeDeleteModal = () => { isDeleteModalOpen.value = false; productToDelete.value = null; };

const handleSubmit = async () => {
  form.value.stock = Number(form.value.stock);
  form.value.price = parseFloat(form.value.price);
  const userId = authStore.user._id;

  if (isEditing.value) {
    await productStore.updateProduct(form.value._id, { ...form.value, user_id: userId }, file.value);
  } else {
    await productStore.createProduct({ ...form.value, user_id: userId }, file.value);
  }
  closeModal();
};

const handleDelete = async () => {
  const userId = authStore.user._id;
  if (productToDelete.value) {
    await productStore.deleteProduct(productToDelete.value._id, userId);
    closeDeleteModal();
  }
};

</script>
