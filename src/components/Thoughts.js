import React, { useEffect, useRef, useState } from "react";
import Speech from "react-speech";

import "./thoughts.css";

import StackGrid from "react-stack-grid";

export default function Thoughts(props) {
	const validModes = ["focus", "stack"];
	const [displayMode, setDisplayMode] = React.useState("");
	const [postsData, setPostsData] = React.useState([]);

	const screenRef = useRef();

	// fetching the data on mount;
	React.useEffect(() => {
		// const url = "https://www.reddit.com/r/Showerthoughts/top/?t=month";
		// by default .json at the end pulls the hot listings
		const url = "https://www.reddit.com/r/Showerthoughts.json";
		fetch(url)
			.then((res) => (res.status !== 200 ? 1 : res.json()))
			.then((json) => {
				console.log(json.data.children);
				setPostsData(json.data.children);
				// if we set the data before we have the data the other components try to render using the data which results in errors.
				setDisplayMode("stack");
			});
	}, []);

	return (
		<div className="viewarea" ref={screenRef}>
			{/*should we add a powerbar here to control the view styles etc ?? */}
			{displayMode === "stack" && (
				<StackGrid columnWidth={300}>
					{postsData &&
						postsData.map((post, i) => (
							<Post key={i} {...post.data}></Post>
						))}
				</StackGrid>
			)}
			{displayMode === "focus" && <Focus postsData={postsData} />}
		</div>
	);
}

function Post({
	title,
	selftext,
	score,
	author,
	total_awards_received,
	num_comments,
	created_utc,
	distinguished,
	displayMode = "stack"
}) {
	// to avoid rendering moderator posts.
	if (distinguished === "moderator") return null;

	return (
		<div className="post">
			<p className="author">{`u/${author}`}</p>
			<h2 className="title">{title || "title"}</h2>
			{selftext && (
				<p className="postbody">
					{(displayMode === "stack" && selftext.slice(0, 200)) ||
						selftext}
				</p>
			)}
			<span className="details">
				score: {score} {total_awards_received} {num_comments}
				{created_utc}
			</span>
			<Speech stop={true} pause={true} resume={true} text={title} />
		</div>
	);
	// score, total_awards_received
}

// return (
// 	<div>
// 		<Post></Post>
// 		{/*
// 			search
// 			top
// 			hot
// 			new
// 			viewstyle -> compact | detailed

// 		*/}
// 	</div>
// );

/**/
const Focus = ({ postsData }) => {
	console.log(postsData);
	const [currentPost, setCurrentPost] = useState(0);
	const [currentComments, setCurrentComments] = useState([]);
	const currentPostData = postsData[currentPost].data;

	const nextPost = (e) => {
		// e.preventDefault()
		setCurrentPost((currentPost) => ++currentPost);
	};

	useEffect(() => {
		// Load Comments
		// let curl = `${currentPostData.url}.json`;
		let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
		fetch(curl)
			.then((res) => res.json())
			.then(console.log)
			.catch(console.log);
		// chance to delete comments from memory when post changes ?...
	}, [currentPostData]);

	return (
		<>
			<Post {...currentPostData} />
			{/*<Comments/>*/}
			{/*<Comments data={currentComments}/>*/}
		</>
	);
};

// const Comments = ({ data }) => {
// 	return (
// 		<div>
// 			{data.map((com) => (
// 				<Comment data={commentObj} />
// 			))}
// 		</div>
// 	);
// };

/**/
