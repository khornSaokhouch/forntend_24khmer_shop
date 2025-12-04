// store/useProductStore.js
import { defineStore } from "pinia";
import api from "../services/api.js";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/products/");

        // ✅ Normalize product data (convert price & stock to numbers)
        this.products = (res.data || []).map((p) => ({
          ...p,
          price: Number(p.price ?? 0),
          stock: Number(p.stock ?? 0),
        }));
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to fetch products";
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();

        // ✅ Ensure we always send clean data
        formData.append("product_name", productData.product_name);
        formData.append("category_id", String(productData.category_id));
        formData.append("stock", String(Number(productData.stock)));
        formData.append("price", String(Number(productData.price)));
        formData.append("description", productData.description || "");
        if (file) formData.append("product_image", file);

        await api.post("/products/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchProducts();
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to create product";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id, productData, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();

        // ✅ Ensure we always send clean data
        formData.append("product_name", productData.product_name);
        formData.append("category_id", String(productData.category_id));
        formData.append("stock", String(Number(productData.stock)));
        formData.append("price", String(Number(productData.price)));
        formData.append("description", productData.description || "");
        if (file) formData.append("product_image", file);

        await api.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchProducts();
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to update product";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      this.loading = true;
      this.error = "";
      try {
        await api.delete(`/products/${id}`);
        await this.fetchProducts();
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to delete product";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
