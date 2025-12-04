// store/usePromotionStore.js
import { defineStore } from "pinia";
import api from "../services/api.js";

export const usePromotionStore = defineStore("promotion", {
  state: () => ({
    promotions: [],
    productsWithPromotions: [], // ✅ NEW STATE
    loading: false,
    error: "",
  }),

  actions: {
    // -------------------------
    // Fetch all promotions
    // -------------------------
    async fetchPromotions() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/promotions/");
        this.promotions = res.data;
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to fetch promotions";
      } finally {
        this.loading = false;
      }
    },

    // -------------------------
    // Fetch products with promotions by category
    // -------------------------
    async fetchProductsWithPromotions(categoryId) {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get(`/promotions/categories/${categoryId}/products_with_promotions`);
        this.productsWithPromotions = res.data; // ✅ store data for UI
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.detail || "Failed to fetch products with promotions";
      } finally {
        this.loading = false;
      }
    },

    // -------------------------
    // Create a promotion
    // -------------------------
    async createPromotion({ promotion_name, description = "", discount_percentage, start_date, end_date, category_ids = [] }) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("promotion_name", promotion_name);
        formData.append("description", description);
        formData.append("discount_percentage", discount_percentage);
        formData.append("start_date", start_date);
        formData.append("end_date", end_date);
        if (category_ids.length) formData.append("category_ids", category_ids.join(","));

        await api.post("/promotions/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchPromotions();
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.detail || "Failed to create promotion";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // -------------------------
    // Update a promotion
    // -------------------------
    async updatePromotion(id, { promotion_name, description, discount_percentage, start_date, end_date, category_ids }) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        if (promotion_name) formData.append("promotion_name", promotion_name);
        if (description !== undefined) formData.append("description", description);
        if (discount_percentage !== undefined) formData.append("discount_percentage", discount_percentage);
        if (start_date) formData.append("start_date", start_date);
        if (end_date) formData.append("end_date", end_date);
        if (category_ids?.length) formData.append("category_ids", category_ids.join(","));

        await api.put(`/promotions/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchPromotions();
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.detail || "Failed to update promotion";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // -------------------------
    // Delete a promotion
    // -------------------------
    async deletePromotion(id) {
      this.loading = true;
      this.error = "";
      try {
        await api.delete(`/promotions/${id}`);
        await this.fetchPromotions();
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.detail || "Failed to delete promotion";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
