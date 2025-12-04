import { defineStore } from "pinia";
import api from "../services/api.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Fetch all users
    async fetchUsers() {
      this.loading = true;
      try {
        const res = await api.get("/users/");
        this.users = res.data;
      } catch (err) {
        this.error = err.response?.data?.detail || err.message;
      } finally {
        this.loading = false;
      }
    },

    // Delete a user
    async deleteUser(userId) {
      try {
        await api.delete(`/users/${userId}`);
        this.users = this.users.filter(u => u.id !== userId);
      } catch (err) {
        this.error = err.response?.data?.detail || err.message;
      }
    },

    // Update a user
    async updateUser(userId, userData, profileImageFile = null) {
      const formData = new FormData();
      for (const key in userData) formData.append(key, userData[key]);
      if (profileImageFile) formData.append("profile_image", profileImageFile);

      try {
        const res = await api.put(`/users/${userId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedUser = res.data;

        // Update local users array reactively
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...updatedUser };
        } else {
          this.users.push(updatedUser);
        }

        // Return updated user for immediate UI update
        return updatedUser;
      } catch (err) {
        this.error = err.response?.data?.detail || err.message;
        throw err; // UI can catch and show toast
      }
    },

    // Fetch a single user (optional)
    async fetchUser(userId) {
      try {
        const res = await api.get(`/users/${userId}`);
        const user = res.data;

        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) this.users[index] = { ...this.users[index], ...user };
        else this.users.push(user);

        return user;
      } catch (err) {
        this.error = err.response?.data?.detail || err.message;
        throw err;
      }
    },
  },
});
