// store/useCartStore.js
import { defineStore } from "pinia";
import api from "../services/api.js";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: { items: [] },
    loading: false,
    updatingItemId: null, // To show spinner on specific item
    error: null,
  }),

  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const res = await api.get("/cart");
        // Ensure structure is safe
        this.cart = res.data.cart || { items: [] }; 
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async updateCartItem(productId, action) {
      this.updatingItemId = productId; // Start spinner for this item
      try {
        const res = await api.post("/cart/update-item", {
          product_id: productId,
          action,
        });
        this.cart = res.data.cart;
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Update failed";
        return false;
      } finally {
        this.updatingItemId = null; // Stop spinner
      }
    },
  },

  getters: {
    itemCount: (state) => state.cart.items.length,
    
    totalPrice: (state) => {
      return state.cart.items.reduce((sum, item) => {
        // Handle case where product might be null (deleted from DB but in cart)
        const price = item.product_id?.price || item.price || 0;
        return sum + (item.quantity * price);
      }, 0);
    }
  }
});