import create from "zustand";
// demoCommentsObject
/*

*/

/*
sortBy
{
	[permalink]: value
}
*/

export const useCommentsStore = create((set, get) => ({
	sortBy: {},
	findSortBy: (link) => {
		return get().sortBy[link];
	},
	setSortBy: (obj) => {
		set((state) => ({
			sortBy: {
				...state.sortBy,
				...obj
			}
		}));
	},
	comments: [],
	addComment: (comment) => {
		set((state) => ({ comments: [...state.comments, comment] }));
	},
	findComment: (link) => {
		// link = `${link}.json`;
		return get().comments.find(
			(val) => `https://www.reddit.com${val.link}.json` === link
		);
	},
	getCommentIndex: (link) => {
		return get().comments.findIndex((val) => val.link === link);
	},
	changeCommentObj: (link, comment) => {
		console.log({ comment });
		const i = get().getCommentIndex(link);
		// comment not found would/should not be reached logically. line added for dev purposes.
		if (i === -1) return null;
		set((state) => ({
			comments: [
				...state.comments.slice(0, i),
				comment,
				...state.comments.slice(i + 1)
			]
		}));
	},
	clearComments: () => {
		set(
			(s) => ({
				...s,
				comments: []
			}),
			true
		);
	}
}));
