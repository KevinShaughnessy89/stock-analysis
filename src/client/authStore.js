import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
	persist(
		(set) => ({
			isAuthenticated: false,
			username: "Guest",
			setUsername: (username) =>
				set({ username, isAuthenticated: username !== "Guest" }),
			logout: () => {
				set({
					username: "Guest",
					isAuthenticated: false,
				});
			},
		}),
		{ name: "auth-storage" }
	)
);
