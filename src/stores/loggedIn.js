import create from "zustand";

export const useLoggedIn = create((set) => ({
	loggedIn: false,
	setLoggedIn: (s) => set({ loggedIn: s })
}));

// ! doies zustand do state mixing thing ? lilke react does.
