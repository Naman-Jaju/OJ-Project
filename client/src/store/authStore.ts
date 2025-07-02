import { create } from "zustand";
import { User, AuthState } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  signupWithGithub: () => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;  
  clearError: () => void;
}

const login = async (email: string, password: string): Promise<User> =>{

}

const signup = async (name: string, email: string, password: string): Promise<User> =>{
  
}

const SocialAuth = async (provider: 'google' | 'github'): Promise<User> => {

}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await login(email, password);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await SocialAuth('google');
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Google login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      loginWithGithub: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await SocialAuth('github');
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'GitHub login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await signup(name, email, password);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false 
          });
          throw error;
        }
      },

      signupWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await SocialAuth('google');
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Google signup failed',
            isLoading: false 
          });
          throw error;
        }
      },

      signupWithGithub: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await SocialAuth('github');
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'GitHub signup failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null,
          isLoading: false 
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              ...userData,
              updatedAt: new Date().toISOString()
            } 
          });
        }
      },

      setUser: (user: User) => {
          set({ 
            user, 
            isAuthenticated: true, 
            error: null,
            isLoading: false 
          });
        },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);