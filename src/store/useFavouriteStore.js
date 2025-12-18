import { defineStore } from "pinia";
import api from "../services/api.js";
import { useAuthStore } from "./authStore";

export const useFavouriteStore = defineStore("favourite", {
  state: () => ({
    favourites: [],
    loading: false,
    error: "",
  }),

  actions: {
    // Helper to get the ID string regardless of whether product_id is populated or not
    getProductId(favoriteItem) {
      if (!favoriteItem || !favoriteItem.product_id) return null;
      // If product_id is an object (populated), return its _id. Otherwise return the string.
      return typeof favoriteItem.product_id === "object"
        ? favoriteItem.product_id._id
        : favoriteItem.product_id;
    },

    async fetchFavourites() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.loading = true;
      try {
        const res = await api.get("/favorites", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.favourites = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch favourites";
      } finally {
        this.loading = false;
      }
    },

    async addFavourite(product_id) {
      const authStore = useAuthStore();
      if (!authStore.user) return null;

      // Optimistic update (optional: makes UI feel faster)
      // You can implement this if you want instant feedback before API responds

      this.loading = true;
      try {
        const res = await api.post(
          "/favorites",
          { product_id },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        // Add the new favorite to the list
        this.favourites.push(res.data.favorite);
        return res.data.favorite;
      } catch (err) {
        if (err.response?.data?.message === "Product already in favorites") {
          await this.fetchFavourites(); // Sync if out of date
        } else {
          this.error = err.response?.data?.message || "Failed to add favourite";
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async removeFavourite(fav_id) {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.loading = true;
      try {
        await api.delete(`/favorites/${fav_id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        // Filter out the removed item
        this.favourites = this.favourites.filter((f) => {
            // Handle both _id (MongoDB default) and id (Virtuals)
            const id = f._id || f.id; 
            return id !== fav_id;
        });
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to remove favourite";
      } finally {
        this.loading = false;
      }
    },

    async toggleFavourite(product) {
      // Use the helper to find the favorite
      const fav = this.favourites.find((f) => this.getProductId(f) === product._id);
      
      if (fav) {
        // Handle _id vs id
        await this.removeFavourite(fav._id || fav.id);
      } else {
        await this.addFavourite(product._id);
      }
    },

    isFavourite(product) {
      if (!product || !product._id) return false;
      // Use the helper to compare IDs safely
      return this.favourites.some((f) => this.getProductId(f) === product._id);
    },
  },
});