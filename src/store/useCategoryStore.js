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
    // ----------------- FETCH ALL -----------------
    async fetchCategories() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/categories/");
        this.categories = res.data.map((cat) => ({
          id: cat._id,
          user_id: cat.user_id?._id || null,
          name: cat.name,
          image: cat.image || null,
          image_id: cat.image_id || null,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        }));
      } catch (err) {
        this.error =
          err.response?.data?.message || "Failed to fetch categories";
      } finally {
        this.loading = false;
      }
    },

    // ----------------- CREATE -----------------
    async createCategory(name, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("name", name);
        // fix
        if (file) formData.append("image", file);

        const res = await api.post("/categories/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Add new category to store reactively
        this.categories.push({
          id: res.data._id,
          user_id: res.data.user_id?._id || null,
          name: res.data.name,
          image: res.data.image || null,
          image_id: res.data.image_id || null,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
        });
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to create category";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ----------------- UPDATE -----------------
    async updateCategory(id, name, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("name", name);
        if (file) formData.append("category_image", file);

        const res = await api.put(`/categories/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update category in store reactively
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = {
            id: res.data._id,
            user_id: res.data.user_id?._id || null,
            name: res.data.name,
            image: res.data.image || null,
            image_id: res.data.image_id || null,
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
          };
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to update category";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ----------------- DELETE -----------------
    async deleteCategory(id) {
      this.loading = true;
      this.error = "";
      try {
        await api.delete(`/categories/${id}`);
        this.categories = this.categories.filter((c) => c.id !== id);
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to delete category";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
