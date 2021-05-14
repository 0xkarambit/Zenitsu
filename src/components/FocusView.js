import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState, useCallback } from "react";
import {
	useHistory,
	useLocation,
	useParams,
	useRouteMatch
} from "react-router-dom";
import Post from "./Post.js";
import Comment from "./Comment.js";

const FocusView = ({
	postsData,
	getComments,
	initPostNo = 0,
	viewStyle,
	shouldBlurAll
}) => {
	const history = useHistory();
	const [currentPost, setCurrentPost] = useState(initPostNo);
	const [currentComments, setCurrentComments] = useState([]); // {url:[url], comments: obj `children[]]`}
	const currentPostData = postsData[currentPost]?.data;
	const [shouldBlur, setBlur] = useState(
		shouldBlurAll && currentPostData?.over_18
	);
	// alert(currentPostData?.over_18);
	// alert(shouldBlur); // undefined on single post load.
	const [unBlurred, setUnBlurred] = useState({});

	useHotkeys("ctrl + b", () => {
		setBlur((b) => !b);
		setUnBlurred((b) => {
			// alert(b[currentPost]);
			b[currentPost] = b[currentPost] === undefined ? true : false;
			return b;
		});
	});

	// currentPostData to be "undefined" means that there is no data. this is the first visit on the page ie to load this specific post from the url pathname
	// we will load the post and comments and until the post has been loaded the currentPostData will be "undefined".
	const {
		params: { subreddit }
	} = useRouteMatch("/:subreddit");

	let permalink = currentPostData?.permalink
		? `https://www.reddit.com${currentPostData.permalink}`
		: window.location.pathname.replace(`/${subreddit}/`, "");

	// const location = useLocation();
	// console.log({ location });

	// const { permalink } = useParams();
	console.log({ permalink });
	// https://github.com/jaywcjlove/hotkeys/#defining-shortcuts
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
					history.replace(
						`/${subreddit}/https://www.reddit.com${postsData[c].data.permalink}`
					);
					return c;
				}
			});
		},
		{},
		[postsData]
	);
	// damn i should read the docs more often. // well the data doesnt change that often so it should be ok.
	// https://johannesklauss.github.io/react-hotkeys-hook/docs-use-hotkeys#memoisation # good website btw.
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
					history.replace(
						`/${subreddit}/https://www.reddit.com${postsData[c].data.permalink}`
					);
					return c;
				}
			});
		}
		// practically we should load more posts at this point. or show a msg when the listing has been finished
	);

	useEffect(() => {
		// realistically this should happen when the sub changes.
		return () => setUnBlurred({});
	}, []);
	useEffect(() => {
		// Load Comments
		// let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
		// todo: change url to permalink in above line
		console.log("CALLED USEEFFECT FOCUSVIEW.js line 54");
		const result = getComments(permalink);
		result.then(({ comObj, data }) => {
			// todo we need better error handling lol.
			if (comObj === 1) alert("likely fetch request went wrong");
			// console.log(comObj);
			setCurrentComments(comObj.comments);
			// for singel page loads
			if (shouldBlur === undefined) {
				setBlur(shouldBlurAll && data.over_18);
			}
		});
		// I HAVE GONE THROUGH A LOT OF TROUBLE FOR THIS UNREAL PROBLEM
		// IG I;;LL JUST STORE THE STATE AND RE USE IT IN CASE OF A REFRESH.
		// BUT THEN HOW DO YOU KNOW IF YOY SHOULD USE LOCALSTATE OR REQUEST NEW ???
		// ? WELL NOW I GUESS ITS A BAD IDEA, JUST USE ANOTHER USESTATE FOR THE SUBREDDIT NAME.
		// ? AND SET IT WHEN THIS UNMOUNTS.
	}, [currentPost]);

	if (currentPostData === undefined) {
		return <h1 style={{ textAlign: "center" }}>Loading Post</h1>;
	}
	return (
		<>
			<Post
				// this returns a div with class "post"
				{...currentPostData}
				displayMode={"focus"}
				shouldBlur={shouldBlur}
				setBlur={setBlur}
				viewStyle={viewStyle}
				shouldBlurAll={shouldBlurAll}
			/>
			<div className="comments">
				{/*<Comments/>*/}
				<h4
					className="comments-section-banner"
					style={{ margin: "12px 0px -2px 12px" }}
				>
					Comments {currentPostData.num_comments}
				</h4>
				{/*todo: show loading comments banner */}
				{currentComments &&
					currentComments.map((commentObj) => {
						if (commentObj.kind === "more") return null;
						return (
							<Comment
								getComments={getComments}
								data={commentObj.data}
								topLevel={true}
								key={commentObj.data.id}
								perma_link={
									currentPostData.perma_link || "permalink"
								}
								setCurrentComments={setCurrentComments}
							/>
						);
					})}
			</div>
		</>
	);
};

export default FocusView;
