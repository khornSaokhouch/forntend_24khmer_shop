import { defineStore } from "pinia";
import api from "../services/api.js";

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchEvents(userId = null) {
      this.loading = true;
      this.error = "";
      try {
        const url = userId ? `/events/?user_id=${userId}` : "/events/";
        const res = await api.get(url);
        this.events = res.data;
      } catch (err) {
        this.error = err.response?.data?.detail || err.message || "Failed to fetch events";
      } finally {
        this.loading = false;
      }
    },

    async fetchEventById(id) {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get(`/events/${id}`);
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.detail || err.message || "Failed to fetch event";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createEvent(eventData, file = null) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("title", eventData.title);
        formData.append(
          "start_date",
          eventData.start_date ? new Date(eventData.start_date).toISOString() : new Date().toISOString()
        );
        formData.append(
          "end_date",
          eventData.end_date ? new Date(eventData.end_date).toISOString() : new Date().toISOString()
        );
        if (eventData.description) formData.append("description", eventData.description);
        if (file) formData.append("event_image", file);

        await api.post("/events/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchEvents();
      } catch (err) {
        this.error = err.response?.data?.detail || err.message || "Failed to create event";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(id, eventData, file = null) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        if (eventData.title) formData.append("title", eventData.title);
        if (eventData.start_date) formData.append("start_date", new Date(eventData.start_date).toISOString());
        if (eventData.end_date) formData.append("end_date", new Date(eventData.end_date).toISOString());
        if (eventData.description) formData.append("description", eventData.description);
        if (file) formData.append("event_image", file);

        await api.put(`/events/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchEvents();
      } catch (err) {
        this.error = err.response?.data?.detail || err.message || "Failed to update event";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(id) {
      this.loading = true;
      this.error = "";
      try {
        await api.delete(`/events/${id}`);
        await this.fetchEvents();
      } catch (err) {
        this.error = err.response?.data?.detail || err.message || "Failed to delete event";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
