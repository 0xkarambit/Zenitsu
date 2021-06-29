import create from "zustand";

export const useLoaded = create((set) => ({
	loaded: false,
	setLoaded: (val) => set({ loaded: val })
}));
