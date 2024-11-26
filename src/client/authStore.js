import { create } from "zustand";

export const useAuthStore = create((set) => ({
	isAuthenticated: false,
	username: "",

	setIsAuthenticated: (value) => set({ isAuthenticated: value }),
	setUsername: (username) => set({ username }),

	logout: () => {
		set({ isAuthenticated: false });
	},
}));
