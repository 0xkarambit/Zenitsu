import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";
import Post from "./Post.js";
import Comment from "./Comment.js";

const FocusView = ({ postsData, getComments, initPostNo = 0, viewStyle }) => {
	const [currentPost, setCurrentPost] = useState(initPostNo);
	const [currentComments, setCurrentComments] = useState([]); // {url:[url], comments: obj `children[]]`}
	const currentPostData = postsData[currentPost]?.data;
	const [shouldBlur, setBlur] = useState(currentPostData?.over_18);
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
					setCurrentComments([]);
					if (postsData[currentPost + 1]?.data?.over_18)
						setBlur(true);
					return ++currentPost;
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
					setCurrentComments([]);
					if (postsData[currentPost + 1]?.data?.over_18)
						setBlur(true);
					return --currentPost;
				}
			});
		}
		// practically we should load more posts at this point. or show a msg when the listing has been finished
	);

	useEffect(() => {
		// Load Comments
		// let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
		// todo: change url to permalink in above line
		console.log("CALLED USEEFFECT FOCUSVIEW.js line 54");
		const result = getComments(permalink);
		result.then((comObj) => {
			// todo we need better error handling lol.
			if (comObj === 1) alert("likely fetch request went wrong");
			console.log(comObj);
			setCurrentComments(comObj.comments);
		});
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
