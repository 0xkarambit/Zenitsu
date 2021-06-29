// ! we cannot use useKeyMappings hook here to add customisable shortcuts. idk why
// if i do try to use it all other shortcuts dont work.

import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

// components
import Post from "./Post.js";
import CommentsSection from "./CommentsSection.js";

// stores
import { useViewStyleStore } from "./../stores/viewStyle.js";
import { useCommentsStore } from "./../stores/commentsStore.js";
// ! but this shows its not a problem with the usehotKeys hook.
// import { useKeyMappings } from "./../stores/keymappings.js";

const FocusView = ({
	postsData,
	getComments,
	initPostNo = { current: 0 },
	viewStyle,
	shouldBlurAll,
	postsSeen,
	setPostsSeen,
	setLastSeen,
	expandView,
	loadListings,
	loaded,
	dStyle
}) => {
	const history = useHistory();
	const [currentPost, setCurrentPost] = useState(initPostNo.current);
	const [currentComments, setCurrentComments] = useState([]); // {url:[url], comments: obj `children[]]`}
	const currentPostData = postsData[currentPost]?.data;
	const [shouldBlur, setBlur] = useState(
		shouldBlurAll && currentPostData?.over_18
	);
	// alert(currentPostData?.over_18);
	// alert(shouldBlur); // undefined on single post load.
	const [unBlurred, setUnBlurred] = useState({});

	const toggleViewStyle = useViewStyleStore((state) => state.toggleViewStyle);

	// #region getting shortcuts mapping
	// const toggleVertSplit = useKeyMappings(
	// 	(s) => s.keyMappings.toggleVertSplit
	// );
	// const blurKeys = useKeyMappings((s) => s.keyMappings.blurkeys);
	// const nextPostKeys = useKeyMappings((s) => s.keyMappings.nextPostKeys);
	// const prevPostKeys = useKeyMappings((s) => s.keyMappings.prevPostKeys);
	// #endregion

	// #region keyboard shortcuts
	// toggleVertSplit
	// useHotkeys(toggleVertSplit, () => toggleViewStyle());
	useHotkeys("v", () => toggleViewStyle());

	// useHotkeys(blurKeys, () => {
	useHotkeys("ctrl + b", () => {
		setBlur((b) => !b);
		setUnBlurred((b) => {
			// alert(b[currentPost]);
			b[currentPost] = b[currentPost] === undefined ? true : false;
			return b;
		});
	});
	// #endregion
	// currentPostData to be "undefined" means that there is no data. this is the first visit on the page ie to load this specific post from the url pathname
	// we will load the post and comments and until the post has been loaded the currentPostData will be "undefined".
	const {
		params: { subreddit }
	} = useRouteMatch("/r/:subreddit");

	// encode here or decode here ??
	let permalink = currentPostData?.permalink
		? `https://www.reddit.com${currentPostData?.permalink}`
		: window.location.pathname.replace(`/r/${subreddit}/`, "");

	// comments changing on resort logic
	const sortBy = useCommentsStore((s) => s.sortBy);
	// ! clear store data on sub change ?
	// ! omg check comments ... ....
	// https://github.com/jaywcjlove/hotkeys/#defining-shortcuts

	// useHotkeys(nextPostKeys,
	useHotkeys(
		"n",
		() => {
			setCurrentPost((currentPost) => {
				if (currentPost === postsData.length - 1) return currentPost;
				else {
					let c = currentPost + 1;
					setCurrentComments([]);
					if (!unBlurred[c] && postsData[c]?.data?.over_18)
						shouldBlurAll && setBlur(true);
					document
						.querySelector("#root")
						.scrollIntoView({ behavior: "smooth" });
					history.replace(
						`/r/${subreddit}/https://www.reddit.com${postsData[c].data.permalink}`
					);
					expandView(c);
					return c;
				}
			});
		},
		{},
		[postsData]
	);
	// damn i should read the docs more often. // well the data doesnt change that often so it should be ok.
	// https://johannesklauss.github.io/react-hotkeys-hook/docs-use-hotkeys#memoisation # good website btw.

	// useHotkeys(prevPostKeys,
	useHotkeys(
		"p",
		() => {
			setCurrentPost((currentPost) => {
				console.log({ currentPost });
				if (currentPost === 0) {
					return 0;
				} else {
					let c = currentPost - 1;
					setCurrentComments([]);
					// why is next log true for every one. ? couldnt get memoised deblurring to work.
					// not switching.. not changing even on ctrl + b on another post.
					console.log({ b: !unBlurred[c] });
					if (!unBlurred[c] && postsData[c]?.data?.over_18)
						shouldBlurAll && setBlur(true);
					document
						.querySelector("#root")
						.scrollIntoView({ behavior: "smooth" });
					history.replace(
						`/r/${subreddit}/https://www.reddit.com${postsData[c].data.permalink}`
					);
					expandView(c);
					return c;
				}
			});
		}
		// practically we should load more posts at this point. or show a msg when the listing has been finished
	);

	// use useEffect caches the values not in the dep array ? hmmm;
	useEffect(() => {
		// realistically this should happen when the sub changes.
		console.warn("FOCUSVIEW mounted!");
		return () => {
			console.log("FOCUSVIEW unmounted !");
			setUnBlurred({});
			// ohmygod wow this fixed the issue;
			/* basically post would not load when going from focusView to StackView (next sub) -> 
			browsing in FocusView -> hitting back 2x to get back to the first FocusView post.*/
			initPostNo.current = 0;
		};
	}, []);

	useEffect(() => {
		// Load Comments
		// let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
		// todo: change url to permalink in above line
		let controller = new AbortController();
		if (dStyle === "imgOnly") {
			if (currentPostData?.over_18)
				setBlur(shouldBlurAll && currentPostData?.over_18);
			// ! wait getComments give the data when its a single page load.
			// ! but a user cant actually already be switched to imgOnly mode on load.
			return null;
			// why does it still make the request if i remove the else statment
		} else {
			setTimeout(() => {
				const result = getComments(permalink, controller.signal);
				result.then(({ comObj, data, aborted }) => {
					if (aborted) return null;
					// todo we need better error handling lol.
					if (comObj === 1) alert("likely fetch request went wrong");
					if (comObj.comments) setCurrentComments(comObj.comments);
					else debugger;
					console.log({ comObj });
					// for singel page loads
					// why do we check if shouldBlur === undefined ?
					if (shouldBlur === undefined) {
						setBlur(shouldBlurAll && data?.over_18);
					}
				});
			}, 1);
		}
		return () => {
			// abort here yes !
			// ok nice !! do this in another effect with only currentPost as dependency.
			// & store controller in ref ?
			controller.abort();
		};
		// I HAVE GONE THROUGH A LOT OF TROUBLE FOR THIS UNREAL PROBLEM
		// IG I;;LL JUST STORE THE STATE AND RE USE IT IN CASE OF A REFRESH.
		// BUT THEN HOW DO YOU KNOW IF YOY SHOULD USE LOCALSTATE OR REQUEST NEW ???
		// ? WELL NOW I GUESS ITS A BAD IDEA, JUST USE ANOTHER USESTATE FOR THE SUBREDDIT NAME.
		// ? AND SET IT WHEN THIS UNMOUNTS.
	}, [postsData, currentPost, sortBy[currentPostData?.permalink], dStyle]);
	// }, [currentPost, sortBy[currentPostData?.permalink]]);
	// we are on the right track
	// }, [postsData, currentPost, sortBy[currentPostData?.permalink]]);
	// added currentPostData?.permalink above.

	if (currentPostData === undefined) {
		return <h1 style={{ textAlign: "center" }}>Loading Post</h1>;
	}
	return (
		<>
			<Post
				// this returns a div with class "post"
				{...currentPostData}
				data={currentPostData}
				displayMode={"focus"}
				shouldBlur={shouldBlur}
				setBlur={setBlur}
				viewStyle={viewStyle}
				shouldBlurAll={shouldBlurAll}
				postsSeen={postsSeen}
				setPostsSeen={setPostsSeen}
				setLastSeen={setLastSeen}
				index={currentPost}
				dStyle={dStyle}
			/>
			{dStyle !== "imgOnly" && (
				<CommentsSection
					{...{
						currentPostData,
						currentComments,
						setCurrentComments
					}}
					permalink={currentPostData.permalink}
				></CommentsSection>
			)}
		</>
	);
};

export default FocusView;
