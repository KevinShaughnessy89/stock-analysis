import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
	persist(
		(set) => ({
			currentRoom: "room",
			setRoomName: (currentRoom) => set({ currentRoom }),
		}),
		{ name: "chat-storage" }
	)
);
