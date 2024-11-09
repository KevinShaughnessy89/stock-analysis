import { create } from 'zustand';

export const useAuthStore = create( (set) => ({

    isAuthenticated: false,

    setIsAuthenticated: (value) => set({isAuthenticated: value}),

    logout: () => {
        set({isAuthenticated: false})
    }
}));