import { defineStore } from 'pinia';
import api from '../lib/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    company: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async register(payload) {
      try {
        const response = await api.post('/register', payload);
        this.setUser(response.data);
      } catch (error) {
        throw error;
      }
    },
    async login(payload) {
      try {
        const response = await api.post('/login', payload);
        this.setUser(response.data);
      } catch (error) {
        throw error;
      }
    },
    async logout() {
      if (this.token) {
        try {
          await api.post('/logout');
        } catch (e) {
          // Ignore error on logout
        }
      }
      this.clearUser();
      localStorage.removeItem('auth_token');
    },
    setUser(data) {
      this.user = data.user;
      this.company = data.company || (data.user && data.user.company);
      this.token = data.token;
      
      // We set token in localStorage so API interceptor can find it easily
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
    },
    clearUser() {
      this.user = null;
      this.company = null;
      this.token = null;
    }
  },
  persist: true, // Use pinia-plugin-persistedstate for localStorage hydration
});
