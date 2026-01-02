import { defineStore } from "pinia";
import api from "../services/api.js";
import { useAuthStore } from "./authStore";

export const useShoppingCartStore = defineStore("shoppingCart", {
  state: () => ({
    cart: { items: [] },
    loading: false,
    error: "",
  }),

  getters: {
    totalItems: (state) =>
      state.cart?.items?.reduce((sum, i) => sum + i.qty, 0) || 0,

    totalPrice: (state) =>
      state.cart?.items?.reduce((sum, i) => sum + i.qty * (i.price || 0), 0) || 0,
  },

  actions: {
    // -----------------------------
    // FETCH CART FOR CURRENT USER
    // -----------------------------
    async fetchCart() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.loading = true;
      this.error = "";

      try {
        const res = await api.get(`/shopping_cart/users/${authStore.user.id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.cart = res.data;
        this.cart.items = this.cart.items || [];
      } catch (err) {
        if (err.response?.status === 404) {
          await this.createCart();
        } else {
          this.error = err.response?.data?.detail || "Failed to fetch cart";
        }
      } finally {
        this.loading = false;
      }
    },

    // -----------------------------
    // CREATE CART FOR CURRENT USER
    // -----------------------------
    async createCart() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      try {
        const res = await api.post(
          "/shopping_cart/",
          { user_id: authStore.user.id },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        this.cart = res.data;
        this.cart.items = this.cart.items || [];
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to create cart";
      }
    },

    // -----------------------------
    // ADD ITEM TO CART
    // -----------------------------
    async addItem(product_id, qty = 1) {
      if (!this.cart?.id) await this.fetchCart();
      if (!this.cart?.id) {
        this.error = "Cart not initialized";
        return;
      }

      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("product_item_id", product_id);
        formData.append("qty", qty);

        const authStore = useAuthStore();
        const res = await api.post(
          `/shopping_cart/${this.cart.id}/items/`,
          formData,
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cart.items.push(res.data);
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to add item";
      } finally {
        this.loading = false;
      }
    },

    // -----------------------------
    // REMOVE ITEM FROM CART
    // -----------------------------
    async removeItem(item_id) {
      if (!this.cart?.id) return;

      this.loading = true;
      this.error = "";
      try {
        const authStore = useAuthStore();
        await api.delete(`/shopping_cart/items/${item_id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.cart.items = this.cart.items.filter(i => i.id !== item_id);
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to remove item";
      } finally {
        this.loading = false;
      }
    },

    // -----------------------------
    // UPDATE ITEM QUANTITY
    // -----------------------------
    async updateItemQty(item_id, qty) {
      if (!this.cart?.id) return;

      this.loading = true;
      this.error = "";
      try {
        const authStore = useAuthStore();
        const res = await api.put(
          `/shopping_cart/items/${item_id}`,
          { qty },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );

        this.cart.items = this.cart.items.map(i =>
          i.id === item_id ? res.data : i
        );
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to update quantity";
      } finally {
        this.loading = false;
      }
    },

    // -----------------------------
    // CLEAR CART LOCALLY
    // -----------------------------
    clearCart() {
      this.cart = { items: [] };
    },
  },

  persist: true, // optional
});
