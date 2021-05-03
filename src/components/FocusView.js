import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import Post from "./Post.js";
import Comment from "./Comment.js";

const FocusView = ({ postsData, getComments, initPostNo = 0 }) => {
	const [currentPost, setCurrentPost] = useState(initPostNo);
	const [currentComments, setCurrentComments] = useState([]);
	// currentComments : {url:[url], comments: obj `children[]]`}
	const currentPostData = postsData[currentPost].data;

	// https://github.com/jaywcjlove/hotkeys/#defining-shortcuts
	useHotkeys("n", () =>
		setCurrentPost((currentPost) =>
			currentPost === postsData.length - 1 ? currentPost : ++currentPost
		)
	);
	useHotkeys(
		"p",
		() =>
			setCurrentPost((currentPost) =>
				currentPost === 0 ? 0 : --currentPost
			)
		// practically we should load more posts at this point. or show a msg when the listing has been finished
	);

	useEffect(() => {
		// Load Comments
		// let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
		let curl = `https://www.reddit.com${currentPostData.permalink}.json`;
		// todo: change url to permalink in above line
		const result = getComments(curl);
		result.then((comObj) => {
			if (comObj === 1) {
				// likely fetch request went wrong.
				alert("likely fetch request went wrong");
				// todo we need better error handling lol.
				return null;
			}
			console.log(comObj);
			setCurrentComments(comObj.comments);
		});
		// document.addEventListener("keydown", _handleEscKey);
		// chance to delete comments from memory when post changes ?...
	}, [currentPostData, currentPost]);

	return (
		<>
			<Post {...currentPostData} displayMode={"focus"} />
			{/*<Comments/>*/}
			<div className="comments">
				{currentComments &&
					currentComments.map((commentObj) => {
						if (commentObj.kind === "more") return null;
						return (
							<Comment
								getComments={getComments}
								data={commentObj.data}
								topLevel={true}
								key={commentObj.data.id}
								perma_link={currentPostData.perma_link}
								setCurrentComments={setCurrentComments}
							/>
						);
					})}
			</div>
		</>
	);
};

export default FocusView;
