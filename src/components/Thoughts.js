import React, { useEffect, useRef, useState } from "react";
// import Speech from "react-speech";
import StackGrid from "react-stack-grid";
import { Switch, Route, Link } from "react-router-dom";

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
	const [permaLinks, setPermaLinks] = React.useState(new Set());
	// comments will be loaded by children components.
	const [comments, setComments] = React.useState([]);

	// fetching the data on mount;
	React.useEffect(() => {
		// to avoid repainting/rerending/changing state when post url is specified in pathname.
		if (window.location.pathname !== "/") return null;
		console.log("status ");
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
					let children = json.data.children;
					setPostsData(children);
					let newLinks = children.map(
						(child) => child.data.permalink
					);
					setPermaLinks(new Set(newLinks));
					// if we set the data before we have the data the other components try to render using the data which results in errors.
					setDisplayMode("stack");
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
		comments.filter(
			(val) => `https://www.reddit.com${val.link}.json` === link
		);

	const getComments = async (postUrl) => {
		postUrl = `${postUrl}.json`;
		console.log("URL REQUESTED FOR COMMENTS");
		console.log(postUrl);

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
			setComments((coms) => [...coms, comObj]);
			// check if postData is there for the post requested in postUrl.
			if (
				!permaLinks.has(
					postUrl
						.slice("https://www.reddit.com".length)
						.replace(".json", "")
				)
			) {
				// postData did not already exist for this meaning that its a SINGLE POST LOAD from the url.
				console.log(permaLinks);
				console.log(
					postUrl
						.slice("https://www.reddit.com".length)
						.replace(".json", "")
				);

				setPostsData(c[0].data.children);
				setPermaLinks(new Set([link]));
			}
			return comObj;
		} catch (e) {
			// ok try to know why it failed
			// wait why did this url even appear here .....
			// todo: inspect the listings obj
			console.log("got here");
			alert("postUrl");
			alert(postUrl);
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
				let newLinks = body.data.children.map(
					(child) => child.data.permalink
				);

				let links = [...permaLinks, ...newLinks];
				setPermaLinks(new Set(links));
				setAfterCode(body.data.after);
			});
	}

	const [initPostNo, setInitPostNo] = useState(0);
	const expandView = (postNo) => {
		setInitPostNo(+postNo);
		setDisplayMode("focus");
	};
	// hmmm is passing initPostNo instead of setInitPostNo gonna take more memry ?

	return (
		<div className="viewarea">
			{/*should we add a powerbar here to control the view styles etc ?? */}
			<Switch>
				<Route exact path="/">
					{dataReceived && (
						<>
							<StackGrid columnWidth={300}>
								{postsData.map((post, i) => (
									<Link
										to={`https://www.reddit.com${post.data.permalink}`}
										style={{ textDecoration: "none" }}
									>
										<Post
											key={i}
											index={i}
											{...post.data}
											expandView={expandView}
										></Post>
									</Link>
								))}
							</StackGrid>
							<Post
								loadMorePosts={loadMorePosts}
								postsLoader={true}
							></Post>
						</>
					)}
				</Route>
				<Route path="/:permalink">
					<FocusView
						postsData={postsData}
						getComments={getComments}
						initPostNo={initPostNo}
					/>
				</Route>
			</Switch>
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
