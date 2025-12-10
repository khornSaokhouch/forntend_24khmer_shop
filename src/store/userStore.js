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
      this.error = null;

      try {
        const res = await api.get("/users/");
        this.users = res.data.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single user
    async fetchUser(userId) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get(`/users/${userId}`);
        const user = res.data.data;

        const index = this.users.findIndex(u => u._id === userId);
        if (index !== -1) this.users[index] = { ...this.users[index], ...user };
        else this.users.push(user);

        return user;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Update a user
    async updateUser(userId, userData, profileImageFile = null) {
      this.loading = true;
      this.error = null;

      const formData = new FormData();
      for (const key in userData) formData.append(key, userData[key]);
      if (profileImageFile) formData.append("profile_image", profileImageFile);

      try {
        const res = await api.put(`/users/${userId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updatedUser = res.data.data;

        const index = this.users.findIndex(u => u._id === userId);
        if (index !== -1) this.users[index] = { ...this.users[index], ...updatedUser };
        else this.users.push(updatedUser);

        return updatedUser;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Delete a user
    async deleteUser(userId) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/users/${userId}`);
        this.users = this.users.filter(u => u._id !== userId);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
