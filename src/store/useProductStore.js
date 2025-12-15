import { defineStore } from "pinia";
import api from "../services/api.js";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    loading: false,
    error: "",
    productDetail: null, // added state for single product
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/products/");
        this.products = (res.data || []).map(p => ({
          ...p,
          price: Number(p.price ?? 0),
          stock: Number(p.stock ?? 0),
        }));
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch products";
      } finally {
        this.loading = false;
      }
    },

    async fetchProductsByUser(userId) {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get(`/products/user/${userId}`);
        this.products = (res.data || []).map(p => ({
          ...p,
          price: Number(p.price ?? 0),
          stock: Number(p.stock ?? 0),
        }));
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch products";
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id) {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get(`/products/${id}`);
        this.productDetail = {
          ...res.data,
          price: Number(res.data.price ?? 0),
          stock: Number(res.data.stock ?? 0),
        };
        console.log("Product fetched:", this.productDetail);
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch product";
        this.productDetail = null;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData, file) {
      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("category_id", productData.category_id);
        formData.append("stock", String(Number(productData.stock)));
        formData.append("price", String(Number(productData.price)));
        formData.append("description", productData.description || "");
        if (file) formData.append("image_product", file);

        await api.post("/products/", formData, { headers: { "Content-Type": "multipart/form-data" } });
        await this.fetchProductsByUser(productData.user_id); // refresh list
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to create product";
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
        formData.append("name", productData.name);
        formData.append("category_id", productData.category_id);
        formData.append("stock", String(Number(productData.stock)));
        formData.append("price", String(Number(productData.price)));
        formData.append("description", productData.description || "");
        if (file) formData.append("image_product", file);

        await api.put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        await this.fetchProductsByUser(productData.user_id);
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to update product";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id, userId) {
      this.loading = true;
      this.error = "";
      try {
        await api.delete(`/products/${id}`);
        await this.fetchProductsByUser(userId);
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to delete product";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
