import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Post from "./Post.js";
import Comment from "./Comment.js";

const FocusView = ({ postsData, getComments, initPostNo = 0 }) => {
	const [currentPost, setCurrentPost] = useState(initPostNo);
	const [currentComments, setCurrentComments] = useState([]); // {url:[url], comments: obj `children[]]`}
	const currentPostData = postsData[currentPost]?.data;
	// currentPostData to be "undefined" means that there is no data. this is the first visit on the page ie to load this specific post from the url pathname
	// we will load the post and comments and until the post has been loaded the currentPostData will be "undefined".
	let permalink = currentPostData?.permalink
		? `https://www.reddit.com${currentPostData.permalink}`
		: window.location.pathname.slice(1);

	const getDataLen = () => postsData.length; // even this returns the old value

	// https://github.com/jaywcjlove/hotkeys/#defining-shortcuts
	useHotkeys("n", () => {
		setCurrentPost((currentPost) => {
			console.log({ currentPost });
			console.log(postsData); // yes this is empty in console.log; even tho dev tools show the current state ie with 1 element
			// NOT WORKING ON SINGLE POST PAGE LOAD.
			// i think this doesnt work because the value of postsData.length gets set here and doesnt change later on ???
			// but this does start working after a hot reload
			if (currentPost === postsData.length - 1) return currentPost;
			else {
				setCurrentComments([]);
				return ++currentPost;
			}
		});
	});
	useHotkeys(
		"p",
		() => {
			setCurrentPost((currentPost) => {
				console.log({ currentPost });
				if (currentPost === 0) {
					return 0;
				} else {
					setCurrentComments([]);
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
		const result = getComments(permalink);
		result.then((comObj) => {
			// todo we need better error handling lol.
			if (comObj === 1) alert("likely fetch request went wrong");
			console.log(comObj);
			setCurrentComments(comObj.comments);
		});
		// window.location.pathname = permalink;
		// document.addEventListener("keydown", _handleEscKey);
		// chance to delete comments from memory when post changes ?...
	}, [currentPost]);

	if (currentPostData === undefined) {
		return <h1 style={{ textAlign: "center" }}>Loading Post</h1>;
	}
	return (
		<>
			<Post {...currentPostData} displayMode={"focus"} />
			{/*<Comments/>*/}
			<div className="comments">
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
