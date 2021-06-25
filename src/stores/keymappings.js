import create from "zustand";

const defaultKeyMappings = {
	"ctrl + shift + b": "toggle blurring over18 content.",
	backspace: "go back",
	g: "scroll to top",
	"shift + /": "show keymappings menu",
	// FOCUS VIEW
	v: "toggle vert-split view",
	"n, p": "scroll to next, previous post",
	"shift + n,p": "gallery next, previous",
	"ctrl + b": "blur/unblur current img in focus mode",
	t: "toggle light & dark themes",
	"/": "search/select sub",
	l: "login with reddit",
	m: "load more listings",
	h: "hide sub header",
	i: "toggle imgOnly mode"
};

// object demo
/*
{
	keyEffectName: {
		desc: ,
		defaultKeys: ""
	}
}

get values from locationStorage

*/
// get values by searching and replace all the uselocationStorage hooks used lol
// ! documented app, focusView, header, imgGallery
const defKeyMappings = {
	// thoughts.js
	showKeyMappingsKeys: "shift + /",
	imgOnlyModeKeys: "i",
	subSelKeys: "/",

	over18ContentBlurKeys: "ctrl + shift + b",
	goBackKeys: "backspace",
	scrollToTopKeys: "g",
	hideHeaderKeys: "h",
	toggleThemeKeys: "t",
	nextImgKeys: "shift + n",
	prevImgKeys: "shift + p",
	loadMorekeys: "m",
	// stackView.js
	startSlideShowKeys: "s",
	rerenderGridKeys: "r",
	loadMorePostsKeys: "m",
	incImgSizeKeys: "shift + =",
	decImgSizeKeys: "shift + -"
	// these 4 cant be used here because if i use them in FocusView.js all other shortcuts stop working after going back into  focusView.
	// -> making a new store for FocusView.js keymappings.
	// toggleVertSplitKeys: "v",
	// blurKeys: "ctrl + b",
	// nextPostKeys: "n",
	// prevPostKeys: "p",
};

const KeyEffects = Object.keys(defKeyMappings);

// ! damn i have been rusty today, do some thinking, katas, etc
// ! make a list of topics i am rusty @ -> js oop, react hooks function programming, debug problems and refactor code, UNDERSTAND HOW STUFF WORKS, LEARN ...
const mappings = {};
for (const effect of KeyEffects) {
	mappings[effect] = localStorage.getItem(effect) || defKeyMappings[effect];
}

export const useKeyMappings = create((set, get) => ({
	...mappings,
	setKeyMapping: (name, keyMapping) => {
		set((state) => ({
			...state,
			[name]: keyMapping
		}));
		localStorage.setItem(name, keyMapping);
	}
}));

/*
USAGE

import { useKeyMappings } from "./../stores/keymappings.js";

// #region
	const [showKeyMappingsKeys, imgOnlyModeKeys, subSelKeys] = useKeyMappings(
		(s) => [s.showKeyMappingsKeys, s.imgOnlyModeKeys, s.subSelKeys]
	);
	// #endregion
*/
