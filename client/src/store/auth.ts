import { create } from "zustand";

interface User {
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAccessToken: (token) => {
    set({ accessToken: token, isAuthenticated: !!token });
  },

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

export default useAuthStore;
