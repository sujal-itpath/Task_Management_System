// src/store/authStore.js
import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../api/constants/apiConstants";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,
  success: false,

  isAdmin: () => {
    const user = get().user;
    return user?.role === "Admin";
  },

  loadUserFromToken: () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null });
        return null;
      }

      const decodedToken = jwtDecode(token);
      const user = {
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'User',
        roleId: decodedToken.roleId
      };
      set({ user });
      return user;
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      set({ user: null });
      return null;
    }
  },

  login: async (credentials) => {
    try {
      set({ loading: true, error: null, success: false });
      const response = await axios.post(API_URL.AUTH.LOGIN, credentials);
      const { token } = response.data;
      
      localStorage.setItem("token", token);
      
      const decodedToken = jwtDecode(token);
      const user = {
        id: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'User',
        roleId: decodedToken.roleId
      };
      
      
      set({ user, loading: false, success: true });
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({ error: errorMessage, loading: false, success: false });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ loading: true, error: null, success: false });
      await axios.post(API_URL.AUTH.REGISTER, data);
      set({ success: true });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Registration failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  forgotPassword: async (data) => {
    try {
      set({ loading: true, error: null, success: false });
      await axios.post(API_URL.AUTH.FORGOT_PASSWORD, data);
      set({ success: true });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error sending reset link",
      });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (data) => {
    try {
      set({ loading: true, error: null, success: false });
      await axios.post(API_URL.AUTH.RESET_PASSWORD, data);
      set({ success: true });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Reset failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  getAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(API_URL.AUTH.GET_ALL_USERS);
      set({ users: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch users";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateUserRole: async (userId, newRole) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(API_URL.AUTH.UPDATE_USER_ROLE, {
        userId,
        role: newRole
      });
      
      if (response.data.message === "User role updated successfully.") {
        // Update the user in the local state
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          ),
          loading: false,
          success: true
        }));
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update user role";
      set({ error: errorMessage, loading: false, success: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, success: false });
  },

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: false }),
}));

export default useAuthStore;
