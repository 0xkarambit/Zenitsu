import create from "zustand";

export const useSnoo = create((set) => ({
	snoo: null,
	setSnoo: (snoo) =>
		set({
			snoo: snoo
		})
}));
