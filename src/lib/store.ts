import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Role {
  id: number;
  role: string;
  role_slug: string;
  home: string;
}

export interface UserData {
  token: string;
  user_id: string;
  user_name: string;
  roles: Role[];
  [key: string]: any;
}

interface AuthState {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      clearUserData: () => set({ userData: null }),
    }),
    {
      name: 'auth-storage',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);
