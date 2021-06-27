import create from "zustand";

/*
? possible values for type, time:

"type":
	"hot", "new", "rising", "top"
"time" for "top":	
	"hour", 
	"day", 
	"week", 
	"month", 
	"year", 
	"all",
*/
export const useListingType = create((set) => ({
	listingType: "hot",
	listingTime: "",
	setListingType: (t) =>
		set({
			listingType: t
		}),
	setListingTime: (t) =>
		set({
			listingTime: t
		})
}));
