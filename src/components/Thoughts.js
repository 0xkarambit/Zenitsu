import React, { useEffect, useRef, useState } from "react";
// import Speech from "react-speech";
import StackGrid from "react-stack-grid";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// styling
import "./thoughts.css";

// components
import Post from "./Post.js";
import FocusView from "./FocusView.js";

export default function Thoughts({
	subreddit,
	setSubreddit,
	previousSubreddit
}) {
	// the displayMode gets set to $TESTINGMODE after every subreddit change.
	const TESTINGMODE = "stack";
	const [afterCode, setAfterCode] = useState("");
	let [dataReceived, setDataReceived] = useState(false);
	// const validModes = ["focus", "stack"];
	const [displayMode, setDisplayMode] = React.useState("");
	const [postsData, setPostsData] = React.useState([]);
	// comments will be loaded by children components.
	const [comments, setComments] = React.useState([]);

	// Code to show post referenced in URL pathname
	useEffect(() => {
		console.log(window.location.pathname);
		if (window.location.pathname !== "/") {
			// BUT IF THIS CODE RUNS THEN WE DONT NEED TO GET THE OTHER 'LISTINGS' .
			// isRedditPosturl
			// window.location.pathname doesnt show ?params at end.
			// console.log(window.location.pathname);
			console.log(window.location.pathname);
			let postUrl = `${window.location.pathname.slice(1)}.json`;
			// let postUrl = `https://www.reddit.com/r/${window.location.pathname}.json`
			fetch(postUrl)
				.then((res) => res.json())
				.then((data) => {
					let d = data[0].data.children;
					setPostsData(d);
					// set comments
					let commOBJ = {
						// check other declaration for duplicae // in url and search
						url: data[0].data.children[0].data.permalink,
						comments: data[1].data.children
					};
					setDataReceived(true);
					setComments([commOBJ]);
					setDisplayMode("focus");
				})
				.catch(console.log);
		}
	}, []);

	// fetching the data on mount;
	React.useEffect(() => {
		// to avoid repainting/rerending/changing state when post url is specified in pathname.
		if (window.location.pathname !== "/") return null;

		// const url = "https://www.reddit.com/r/Showerthoughts/top/?t=month";
		// by default .json at the end pulls the hot listings
		// is this try-catch useless lol.
		try {
			// how do i load the top listings !!??
			const url = `https://www.reddit.com/r/${subreddit}.json`;
			fetch(url)
				.then((res) => {
					if (res.status === 200) return res.json();
					// ok so the try-catch cant catch errors thrown in these callbacks hmmm.
					else if (res.status === 403) throw Error("private");
					else if (res.status === 404) throw Error("Not Found");
				})
				.then((json) => {
					console.log(json.data.children);
					setPostsData(json.data.children.slice(1));
					// if we set the data before we have the data the other components try to render using the data which results in errors.
					setDisplayMode(TESTINGMODE);
					setDataReceived(true);
					setAfterCode(json.data.after);
				})
				.catch((e) => {
					// todo: add msg for community doesnt exist 404
					if (e.message === "private") {
						alert("cannot browse private community");
					} else if (e.message === "Not Found") {
						alert("no such community exists");
					}
					setSubreddit(previousSubreddit.current);
				});
		} catch (e) {
			console.log(e);
		}
	}, [subreddit]);

	const findComment = (link) =>
		comments.filter((val) => `${val.link}.json` === link);

	const getComments = async (postUrl) => {
		console.log("HEY", postUrl);
		// todo: FIX: find comment is not working
		let foundCom = findComment(postUrl);
		console.log({ foundCom });
		if (foundCom.length !== 0) return foundCom[0];

		// if comments are not in comments fetch them;
		try {
			const res = await fetch(postUrl);
			const c = await res.json();
			let link = c[0].data.children[0].data.permalink; // | id | subreddit_id | title | permalink | url;
			// kind: "listing" | "t1" | "t3"
			let comObj = {
				link: link,
				comments: c[1].data.children
			};
			setComments((coms) => coms.concat([comObj]));
			return comObj;
		} catch (e) {
			// ok try to know why it failed
			// wait why did this url even appear here .....
			// todo: inspect the listings obj
			console.log("got here");
			if (e.message === "Failed to fetch") {
				// likely an image
				const img = await fetch(postUrl.slice(0, postUrl.length - 5));
				const blob = await img.blob();
				// blob to base64data;
				let base64data = "";
				var reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = function () {
					base64data = reader.result;
					console.log(base64data);
				};
			}
			return 1;
		}
	};

	function loadMorePosts() {
		if (["", null].includes(afterCode)) return null;
		const url = `https://www.reddit.com/r/${subreddit}.json?after=${afterCode}`;
		fetch(url)
			.then((res) => res.json())
			.then((body) => {
				setPostsData((posts) => [...posts, ...body.data.children]);
				setAfterCode(body.data.after);
			});
	}

	const initPostNo = useRef(0);
	const expandView = (postNo) => {
		console.log(postNo);
		initPostNo.current = Number(postNo);
		setDisplayMode("focus");
	};
	// hmmm is passing initPostNo instead of setInitPostNo gonna take more memry ?

	return (
		<div className="viewarea">
			{/*should we add a powerbar here to control the view styles etc ?? */}
			{displayMode === "stack" && (
				<>
					<StackGrid columnWidth={300}>
						{postsData &&
							// this doesnt need any initial no data phase protection coz postsData has 0 elements at that time
							postsData.map((post, i) => (
								<Post
									key={i}
									index={i}
									{...post.data}
									expandView={expandView}
								></Post>
							))}
					</StackGrid>
					<Post
						loadMorePosts={loadMorePosts}
						postsLoader={true}
					></Post>
				</>
			)}
			{/*when i used the useRef hook to store dataReceived it didnt work coz after being set to true it did not cause a re-render */}
			{displayMode === "focus" && dataReceived && (
				<FocusView
					postsData={postsData}
					getComments={getComments}
					initPostNo={initPostNo.current}
				/>
			)}
		</div>
	);
}

// {
// 	data.replies.data.children.map((replyData) => {
// 		// replyData is a standard comment Obj
// 		if (replyData.kind == "more") return null;
// 		// todo: return a <load more/> component;
// 		return <Comment data={replyData.data} ml={ml + 2}></Comment>;
// 		// {data.replies && <Comment data={data.replies.data.children}></Comment>}
// 	});
// }
