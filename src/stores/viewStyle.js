import create from "zustand";

export const useViewStyleStore = create((set) => ({
	viewStyle: false,
	toggleViewStyle: () => set(({ viewStyle }) => ({ viewStyle: !viewStyle }))
}));
