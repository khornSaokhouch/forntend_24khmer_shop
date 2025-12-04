<template>
  <div class="bg-white/95 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
    <h3 class="text-2xl font-bold text-slate-800 mb-6">
      {{ isEdit ? "Edit Event" : "Create New Event" }}
    </h3>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Title -->
      <div>
        <label for="event-title" class="block text-sm font-medium text-slate-700 mb-2">Title</label>
        <input 
          id="event-title"
          v-model="form.title" 
          required 
          type="text" 
          placeholder="e.g., Summer Sale"
          class="input-style" 
        />
      </div>

      <!-- Start & End Dates -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="start-date" class="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
          <input 
            id="start-date"
            v-model="form.start_date" 
            required 
            type="datetime-local"
            class="input-style" 
          />
        </div>
        <div>
          <label for="end-date" class="block text-sm font-medium text-slate-700 mb-2">End Date</label>
          <input 
            id="end-date"
            v-model="form.end_date" 
            required 
            type="datetime-local"
            class="input-style" 
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea 
          id="description"
          v-model="form.description" 
          rows="3" 
          placeholder="Write a brief description about the event..."
          class="input-style"
        ></textarea>
      </div>

      <!-- Image Upload & Preview -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Event Image</label>
        <input 
          type="file" 
          @change="onFileChange" 
          accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
        />
        <img v-if="preview" :src="preview" class="mt-4 max-h-48 rounded-lg border border-slate-200 shadow-sm" alt="Image Preview"/>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-4">
        <button 
          type="button" 
          @click="$emit('cancel')"
          class="flex-1 px-4 py-3 bg-slate-200 text-slate-800 rounded-xl font-medium hover:bg-slate-300 transition"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          :disabled="store.loading"
          class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <div v-if="store.loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ isEdit ? "Update Event" : "Create Event" }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useEventStore } from "@/store/useEventStore";

// Props and Emits allow communication with the parent component
const props = defineProps({
  modelValue: Object // This is used for v-model on the component
});
const emit = defineEmits(["cancel", "done"]);

const store = useEventStore();
const isEdit = computed(() => !!props.modelValue);
const API_URL = import.meta.env.VITE_API_URL;

// Local state for the form
const form = ref({});
const file = ref(null);
const preview = ref("");

// Helper to format ISO date string for <input type="datetime-local">
const toDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  // Adjust for timezone offset to display correctly in the user's local time
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// Watch for changes in the prop (when editing an event)
watch(() => props.modelValue, (eventToEdit) => {
  if (eventToEdit) {
    // We are in "edit" mode, so pre-fill the form
    form.value = {
      title: eventToEdit.title || "",
      start_date: toDateTimeLocal(eventToEdit.start_date),
      end_date: toDateTimeLocal(eventToEdit.end_date),
      description: eventToEdit.description || "",
    };
    preview.value = eventToEdit.event_image ? `${API_URL}/${eventToEdit.event_image}` : "";
    file.value = null; // Clear any previously selected file
  } else {
    // We are in "create" mode, so reset the form
    form.value = { title: "", start_date: "", end_date: "", description: "" };
    file.value = null;
    preview.value = "";
  }
}, { immediate: true, deep: true });

function onFileChange(e) {
  const selectedFile = e.target.files?.[0];
  if (!selectedFile) return;
  file.value = selectedFile;
  preview.value = URL.createObjectURL(selectedFile);
}

async function onSubmit() {
  try {
    const payload = { ...form.value };
    if (isEdit.value) {
      await store.updateEvent(props.modelValue.id, payload, file.value);
    } else {
      await store.createEvent(payload, file.value);
    }
    // Signal to the parent that the operation was successful
    emit("done");
  } catch (err) {
    console.error("EventForm submit failed", err);
    // Error is handled in the store, so no need to show it here
  }
}
</script>

<style>
/* Reusable style for form inputs */
.input-style {
  @apply w-full border border-slate-300 rounded-lg p-3 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition;
}
</style>