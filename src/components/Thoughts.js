import React, { useEffect, useRef, useState } from "react";
import Speech from "react-speech";

import "./thoughts.css";

import StackGrid from "react-stack-grid";
import { useHotkeys } from "react-hotkeys-hook";

export default function Thoughts(props) {
	const TESTINGMODE = "focus";
	let [dataReceived, setDataReceived] = useState(false);
	const validModes = ["focus", "stack"];
	const [displayMode, setDisplayMode] = React.useState("");
	const [postsData, setPostsData] = React.useState([]);
	// comments will be loaded by children components.
	const [comments, setComments] = React.useState([]);

	// fetching the data on mount;
	React.useEffect(() => {
		// const url = "https://www.reddit.com/r/Showerthoughts/top/?t=month";
		// by default .json at the end pulls the hot listings
		const url = "https://www.reddit.com/r/Showerthoughts.json";
		fetch(url)
			.then((res) => (res.status !== 200 ? 1 : res.json()))
			.then((json) => {
				console.log(json.data.children);
				setPostsData(json.data.children.slice(1));
				// if we set the data before we have the data the other components try to render using the data which results in errors.
				setDisplayMode(TESTINGMODE);
				setDataReceived(true);
			})
			.catch(console.log);
	}, []);

	const findComment = (url) =>
		comments.filter((val) => `${val.url}.json` === url);

	const getComments = async (postUrl) => {
		console.log("HEY", postUrl);
		// todo: FIX: find comment is not working
		let foundCom = findComment(postUrl);
		console.log({ foundCom });
		if (foundCom.length !== 0) return foundCom[0];

		// if comments are not in comments fetch them;
		const res = await fetch(postUrl);
		const c = await res.json();
		let url = c[0].data.children[0].data.url; // | id | subreddit_id | title | permalink | url;
		// kind: "listing" | "t1" | "t3"
		let comObj = {
			url: url,
			comments: c[1].data.children
		};
		setComments((coms) => coms.concat([comObj]));
		return comObj;
	};

	return (
		<div className="viewarea">
			{/*should we add a powerbar here to control the view styles etc ?? */}
			{displayMode === "stack" && (
				<StackGrid columnWidth={300}>
					{postsData &&
						// this doesnt need any initial no data phase protection coz postsData has 0 elements at that time
						postsData.map((post, i) => (
							<Post key={i} {...post.data}></Post>
						))}
				</StackGrid>
			)}
			{/*when i used the useRef hook to store dataReceived it didnt work coz after being set to true it did not cause a re-render */}
			{displayMode === "focus" && dataReceived && (
				<Focus postsData={postsData} getComments={getComments} />
			)}
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
	// to avoid rendering moderator posts. todo: PUT THIS IN focus mode?
	// if (distinguished === "moderator") return null;

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

const Focus = ({ postsData, getComments }) => {
	const [currentPost, setCurrentPost] = useState(0);
	const [currentComments, setCurrentComments] = useState([]);
	// currentComments : {url:[url], comments: obj `children[]]`}
	const currentPostData = postsData[currentPost].data;

	// https://github.com/jaywcjlove/hotkeys/#defining-shortcuts
	useHotkeys("n", () => setCurrentPost((currentPost) => ++currentPost));
	useHotkeys("p", () => setCurrentPost((currentPost) => --currentPost));

	// /////////////////////////////
	// const _handleEscKey = function (event) {
	// 	console.log(event);
	// 	if (event.keyCode === 27) {
	// 		console.error("lol");
	// 	}
	// };
	// /////////////////////////////

	useEffect(() => {
		// Load Comments
		// let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
		let curl = `${currentPostData.url}.json`;
		getComments(curl).then((comObj) => {
			console.log(comObj);
			setCurrentComments(comObj.comments);
		});
		// document.addEventListener("keydown", _handleEscKey);
		// chance to delete comments from memory when post changes ?...
	}, [currentPostData, currentPost]);

	return (
		<>
			<Post {...currentPostData} />
			{/*<Comments/>*/}
			<div className="comments">
				{currentComments &&
					currentComments.map((commentObj) => {
						if (commentObj.kind === "more") return null;
						return (
							<Comment
								data={commentObj.data}
								topLevel={true}
								key={commentObj.data.id}
							/>
						);
					})}
			</div>
		</>
	);
};

const Comment = ({ data, ml = 0, topLevel = false }) => {
	// Comment is a recursive component.
	const styles = { marginLeft: `${ml}px` };
	const mlinc = 20;
	let className = topLevel ? "toplevel comment" : "comment";
	return (
		// using key as [commentObj]data.id idk how the id is used in reddit tho.
		<div className={className}>
			<p style={styles}> {data.body} </p>
			{data.replies !== "" &&
				data.replies.data.children.map((replyData) => {
					// replyData is a standard comment Obj
					if (replyData.kind === "more") return null;
					// todo: return a <load more/> component;
					return (
						<Comment
							data={replyData.data}
							ml={ml + mlinc}
							key={replyData.data.id}
						/>
					);
					// {data.replies && <Comment data={data.replies.data.children}></Comment>}
				})}
		</div>
	);
};

// {
// 	data.replies.data.children.map((replyData) => {
// 		// replyData is a standard comment Obj
// 		if (replyData.kind == "more") return null;
// 		// todo: return a <load more/> component;
// 		return <Comment data={replyData.data} ml={ml + 2}></Comment>;
// 		// {data.replies && <Comment data={data.replies.data.children}></Comment>}
// 	});
// }
