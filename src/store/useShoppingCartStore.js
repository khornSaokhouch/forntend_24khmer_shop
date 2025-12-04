import { defineStore } from "pinia";
import api from "../services/api.js";
import { useAuthStore } from "./authStore";

export const useShoppingCartStore = defineStore("shoppingCart", {
  state: () => ({
    cart: null,
    loading: false,
    error: "",
  }),

  actions: {
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

    async addItem(product_id, qty = 1) {
      if (!this.cart) await this.fetchCart();

      if (!this.cart) {
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
        const res = await api.post(`/shopping_cart/${this.cart.id}/items/`, formData, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });

        this.cart.items.push(res.data);
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to add item";
      } finally {
        this.loading = false;
      }
    },

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
  },

  persist: true,
});
