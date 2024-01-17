import create from "zustand";

export const useAccessToken = create((set) => ({
	accessToken: null,
	setAccessToken: (val) => set({ accessToken: val })
}));
