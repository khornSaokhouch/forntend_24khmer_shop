import { defineStore } from "pinia";
import api from "../services/api.js";
import { useAuthStore } from "./authStore";

export const useFavouriteStore = defineStore("favourite", {
  id: "favourite",
  state: () => ({
    favourites: [], // store {id, product_id, product}
    loading: false,
    error: "",
  }),

  actions: {
    async fetchFavourites() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/favourites/", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });

        // Map favourites and fetch product data
        const favouritesWithProducts = await Promise.all(
          res.data.map(async fav => {
            try {
              const productRes = await api.get(`/products/${fav.product_id}`);
              return { ...fav, product: productRes.data };
            } catch {
              return { ...fav, product: null };
            }
          })
        );

        this.favourites = favouritesWithProducts;
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to fetch favourites";
      } finally {
        this.loading = false;
      }
    },

    async addFavourite(product_id) {
      const authStore = useAuthStore();
      if (!authStore.user) return null;

      this.loading = true;
      this.error = "";
      try {
        const formData = new FormData();
        formData.append("product_id", product_id);

        const res = await api.post("/favourites/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        // fetch product data immediately
        const productRes = await api.get(`/products/${product_id}`);
        this.favourites.push({ ...res.data, product: productRes.data });

        return res.data;
      } catch (err) {
        if (err.response?.data?.detail === "Already added to favourites") {
          await this.fetchFavourites(); // sync state
        } else {
          this.error = err.response?.data?.detail || "Failed to add favourite";
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
      this.error = "";
      try {
        await api.delete(`/favourites/${fav_id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.favourites = this.favourites.filter(f => f.id !== fav_id);
      } catch (err) {
        this.error = err.response?.data?.detail || "Failed to remove favourite";
      } finally {
        this.loading = false;
      }
    },
  },
});
