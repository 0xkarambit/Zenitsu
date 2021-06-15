// ! not being used anywhere

import create from "zustand";

const defMappings = {
	toggleVertSplitKeys: "v",
	blurKeys: "ctrl + b",
	nextPostKeys: "n",
	prevPostKeys: "p"
};

const KeyEffects = Object.keys(defMappings);

const mappings = {};
for (const effect of KeyEffects) {
	mappings[effect] = localStorage.getItem(effect) || defMappings[effect];
}

export const useFocusViewKeyMappings = create((set, get) => ({
	...mappings,
	setKeyMapping: (name, keyMapping) => {
		set((state) => ({
			...state,
			[name]: keyMapping
		}));
		localStorage.setItem(name, keyMapping);
	}
}));
