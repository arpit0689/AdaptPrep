import { create } from 'zustand';
import { api } from '../services/api';

const storedUser = localStorage.getItem('adaptprep_user');

export const useAuthStore = create((set, get) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('adaptprep_token'),
  loading: false,
  error: '',
  login: async (payload) => {
    set({ loading: true, error: '' });
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('adaptprep_token', data.token);
    localStorage.setItem('adaptprep_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, loading: false });
  },
  register: async (payload) => {
    set({ loading: true, error: '' });
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('adaptprep_token', data.token);
    localStorage.setItem('adaptprep_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, loading: false });
  },
  refreshMe: async () => {
    if (!get().token) return;
    const { data } = await api.get('/auth/me');
    localStorage.setItem('adaptprep_user', JSON.stringify(data.user));
    set({ user: data.user });
  },
  setUser: (user) => {
    localStorage.setItem('adaptprep_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('adaptprep_token');
    localStorage.removeItem('adaptprep_user');
    set({ user: null, token: null });
  }
}));
