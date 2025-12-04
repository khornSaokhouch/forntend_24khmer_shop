<template>
  <div>
    <!-- Header: Title and Add Button -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Promotion Management</h1>
        <p class="text-slate-500">Create and manage sales, discounts, and promotional events.</p>
      </div>
      <button 
        @click="openAddModal"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
      >
        <Plus class="w-5 h-5" />
        <span>Add Promotion</span>
      </button>
    </div>

    <!-- Promotions Table Container -->
    <div class="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg overflow-hidden">
      <div v-if="promotionStore.loading" class="p-20 text-center text-slate-500">Loading promotions...</div>
      <table v-else class="w-full">
        <thead class="bg-slate-50/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Promotion Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Discount</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applies To</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="promo in promotionStore.promotions" :key="promo.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900">{{ promo.promotion_name }}</div>
              <div class="text-sm text-slate-500 line-clamp-1">{{ promo.description }}</div>
            </td>
            <td class="px-6 py-4 font-semibold text-blue-600">{{ promo.discount_percentage }}%</td>
            <td class="px-6 py-4">
              <span :class="getPromoStatus(promo).class" class="px-2 py-1 text-xs font-bold rounded-full border">{{ getPromoStatus(promo).text }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="cat in promo.categories" :key="cat.id" class="bg-slate-100 text-slate-700 px-2 py-1 text-xs font-medium rounded-full">{{ cat.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="startEdit(promo)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"><Edit class="w-5 h-5" /></button>
              <button @click="openDeleteModal(promo)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors ml-2"><Trash2 class="w-5 h-5" /></button>
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
      <div v-if="isFormModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute " @click="closeFormModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-2xl w-full mx-auto shadow-2xl">
          <h3 class="text-xl font-semibold text-slate-900 mb-6">{{ isEditing ? 'Edit Promotion' : 'Create New Promotion' }}</h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Promotion Name</label>
                <input v-model="form.promotion_name" required class="input-style" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Discount (%)</label>
                <input v-model.number="form.discount_percentage" type="number" min="0" max="100" required class="input-style" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input v-model="form.start_date" type="datetime-local" required class="input-style" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input v-model="form.end_date" type="datetime-local" required class="input-style" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input v-model="form.description" class="input-style" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Apply to Categories (hold Ctrl/Cmd to select multiple)</label>
                <select v-model="form.category_ids" multiple class="input-style h-32">
                  <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" @click="closeFormModal" class="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button>
              <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">{{ isEditing ? 'Update' : 'Create' }}</button>
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
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Delete Promotion</h3>
          <p class="text-slate-600 mb-6">Are you sure you want to delete <strong class="text-slate-800">{{ promotionToDelete?.promotion_name }}</strong>?</p>
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
import { ref, reactive, onMounted, computed } from "vue";
import { usePromotionStore } from "@/store/usePromotionStore.js";
import { useCategoryStore } from "@/store/useCategoryStore.js";
import { Plus, Edit, Trash2 } from 'lucide-vue-next';

const promotionStore = usePromotionStore();
const categoryStore = useCategoryStore();

// Form state
const form = reactive({
  promotion_name: "",
  description: "",
  discount_percentage: 0,
  start_date: "",
  end_date: "",
  category_ids: [],
});
const promotionToEdit = ref(null);
const isEditing = computed(() => !!promotionToEdit.value);

// UI state for modals
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const promotionToDelete = ref(null);

onMounted(() => {
  categoryStore.fetchCategories();
  promotionStore.fetchPromotions();
});

const toDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// Form and Modal Handlers
const resetForm = () => {
  Object.assign(form, { promotion_name: "", description: "", discount_percentage: 0, start_date: "", end_date: "", category_ids: [] });
  promotionToEdit.value = null;
};

const openAddModal = () => {
  resetForm();
  isFormModalOpen.value = true;
};

const startEdit = (promo) => {
  promotionToEdit.value = promo;
  Object.assign(form, {
    promotion_name: promo.promotion_name,
    description: promo.description,
    discount_percentage: promo.discount_percentage,
    start_date: toDateTimeLocal(promo.start_date),
    end_date: toDateTimeLocal(promo.end_date),
    category_ids: promo.categories.map(c => c.id),
  });
  isFormModalOpen.value = true;
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
};

const openDeleteModal = (promo) => {
  promotionToDelete.value = promo;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  promotionToDelete.value = null;
};

// CRUD Actions
const handleSubmit = async () => {
  if (isEditing.value) {
    await promotionStore.updatePromotion(promotionToEdit.value.id, { ...form });
  } else {
    await promotionStore.createPromotion({ ...form });
  }
  closeFormModal();
};

const handleDelete = async () => {
  if (promotionToDelete.value) {
    await promotionStore.deletePromotion(promotionToDelete.value.id);
    closeDeleteModal();
  }
};

const getPromoStatus = (promo) => {
  const now = new Date();
  const start = new Date(promo.start_date);
  const end = new Date(promo.end_date);
  if (now < start) return { text: 'Upcoming', class: 'bg-blue-100 text-blue-800 border-blue-200' };
  if (now >= start && now <= end) return { text: 'Active', class: 'bg-green-100 text-green-800 border-green-200 animate-pulse' };
  return { text: 'Expired', class: 'bg-slate-100 text-slate-800 border-slate-200' };
};
</script>

<style>
.input-style {
  @apply w-full border border-slate-300 rounded-lg p-3 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition;
}
</style>