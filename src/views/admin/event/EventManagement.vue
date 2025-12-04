<template>
  <div>
    <!-- Header: Title and Add Event Button -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Event Management</h1>
        <p class="text-slate-500">Create, update, and manage all promotional events.</p>
      </div>
      <button 
        @click="openAddModal"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
      >
        <Plus class="w-5 h-5" />
        <span>Add Event</span>
      </button>
    </div>

    <!-- Events Grid -->
    <div v-if="store.loading" class="text-center py-20">
      <div class="w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin mx-auto"></div>
    </div>
    <div v-else-if="store.events.length === 0" class="text-center py-20 text-slate-500">
      No events found. Click "Add Event" to create one.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in store.events"
        :key="event.id"
        class="group bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
      >
        <div class="relative">
          <img
            v-if="event.event_image"
            :src="`${API_URL}/${event.event_image}`"
            :alt="event.title"
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
            <Calendar class="w-12 h-12" />
          </div>
          <!-- Status Badge -->
          <span :class="getEventStatus(event).class" class="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full border">
            {{ getEventStatus(event).text }}
          </span>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <h3 class="font-bold text-lg text-slate-800 mb-2">{{ event.title }}</h3>
          <div class="text-sm text-slate-500 space-y-1 mb-4">
            <p><strong>Starts:</strong> {{ formatDate(event.start_date) }}</p>
            <p><strong>Ends:</strong> {{ formatDate(event.end_date) }}</p>
          </div>
          <div class="mt-auto flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button @click="openEditModal(event)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors" title="Edit Event">
              <Edit class="w-5 h-5" />
            </button>
            <button @click="openDeleteModal(event)" class="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors" title="Delete Event">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute " @click="closeModal"></div>
        
        <!-- Event Form -->
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
          <h3 class="text-2xl font-bold text-slate-800 mb-6">{{ isEdit ? "Edit Event" : "Create New Event" }}</h3>
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            <div>
              <label for="event-title" class="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input v-model="form.title" required type="text" id="event-title" placeholder="e.g., Summer Sale" class="input-style" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="start-date" class="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input v-model="form.start_date" required type="datetime-local" id="start-date" class="input-style" />
              </div>
              <div>
                <label for="end-date" class="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input v-model="form.end_date" required type="datetime-local" id="end-date" class="input-style" />
              </div>
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea v-model="form.description" rows="3" id="description" placeholder="Write a brief description..." class="input-style"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Event Image</label>
              <input type="file" @change="onFileChange" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <img v-if="preview" :src="preview" class="mt-4 max-h-48 rounded-lg border border-slate-200 shadow-sm" alt="Image Preview"/>
            </div>
            <div class="flex gap-4 pt-4">
              <button type="button" @click="closeModal" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition">Cancel</button>
              <button type="submit" :disabled="store.loading" class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                <div v-if="store.loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{{ isEdit ? "Update Event" : "Create Event" }}</span>
              </button>
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
        <div class="absolute " @click="closeDeleteModal"></div>
        <div class="relative bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Delete Event</h3>
          <p class="text-slate-600 mb-6">Are you sure you want to delete the event <strong class="text-slate-800">{{ eventToDelete?.title }}</strong>?</p>
          <div class="flex space-x-4">
            <button @click="closeDeleteModal" class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition">Cancel</button>
            <button @click="handleDeleteEvent" class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useEventStore } from "@/store/useEventStore";
import { Plus, Edit, Trash2, Calendar } from 'lucide-vue-next';

const store = useEventStore();
const API_URL = import.meta.env.VITE_API_URL;

// Form State
const isEdit = computed(() => !!eventToEdit.value);
const form = ref({});
const file = ref(null);
const preview = ref("");

// UI State
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const eventToEdit = ref(null);
const eventToDelete = ref(null);

onMounted(() => {
  store.fetchEvents();
});

// Watcher to populate form when `eventToEdit` changes
watch(() => eventToEdit.value, (eventData) => {
  if (eventData) { // Editing an existing event
    form.value = {
      title: eventData.title || "",
      start_date: toDateTimeLocal(eventData.start_date),
      end_date: toDateTimeLocal(eventData.end_date),
      description: eventData.description || "",
    };
    preview.value = eventData.event_image ? `${API_URL}/${eventData.event_image}` : "";
    file.value = null;
  } else { // Creating a new event
    form.value = { title: "", start_date: "", end_date: "", description: "" };
    file.value = null;
    preview.value = "";
  }
}, { immediate: true, deep: true });

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

const getEventStatus = (event) => {
  const now = new Date();
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  if (now < start) return { text: 'Upcoming', class: 'bg-blue-100 text-blue-800 border-blue-200' };
  if (now >= start && now <= end) return { text: 'Active', class: 'bg-green-100 text-green-800 border-green-200 animate-pulse' };
  return { text: 'Finished', class: 'bg-slate-100 text-slate-800 border-slate-200' };
};

const toDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// Form Handlers
const onFileChange = (e) => {
  const selectedFile = e.target.files?.[0];
  if (!selectedFile) return;
  file.value = selectedFile;
  preview.value = URL.createObjectURL(selectedFile);
};

const handleFormSubmit = async () => {
  try {
    const payload = { ...form.value };
    if (isEdit.value) {
      await store.updateEvent(eventToEdit.value.id, payload, file.value);
    } else {
      await store.createEvent(payload, file.value);
    }
    closeModal();
    // No need to fetch here, the store already does it.
  } catch (err) {
    console.error("Form submit failed", err);
  }
};

// Modal Handlers
const openAddModal = () => {
  eventToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (event) => {
  eventToEdit.value = event;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const openDeleteModal = (event) => {
  eventToDelete.value = event;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  eventToDelete.value = null;
};

const handleDeleteEvent = async () => {
  if (eventToDelete.value) {
    await store.deleteEvent(eventToDelete.value.id);
    closeDeleteModal();
  }
};
</script>

<style>
.input-style {
  @apply w-full border border-slate-300 rounded-lg p-3 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition;
}
</style>