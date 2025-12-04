// store/useCategoryStore.js
import { defineStore } from "pinia";
import api from "../services/api.js";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/categories/");
        this.categories = res.data;
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to fetch categories";
      } finally {
        this.loading = false;
      }
    },

    async createCategory(name, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("name", name);
        if (file) formData.append("category_image", file);

        await api.post("/categories/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchCategories();
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to create category";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(id, name, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("name", name);
        if (file) formData.append("category_image", file);

        await api.put(`/categories/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchCategories();
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to update category";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id) {
      this.loading = true;
      this.error = "";
      try {
        await api.delete(`/categories/${id}`);
        await this.fetchCategories();
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to delete category";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
