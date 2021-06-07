import React, { useEffect, useRef, useState } from "react";
// import Speech from "react-speech";
import { useHotkeys } from "react-hotkeys-hook";
import StackGrid from "react-stack-grid";
import {
	Switch,
	Route,
	Link,
	useParams,
	useHistory,
	useLocation,
	useRouteMatch
} from "react-router-dom";

// styling
import "./thoughts.css";

// components
import Post from "./Post.js";
import FocusView from "./FocusView.js";
import StackView from "./StackView.js";

// stores
import { useViewStyleStore } from "./../stores/viewStyle.js";

export default function Thoughts({ shouldBlurAll }) {
	// the displayMode gets set to $TESTINGMODE after every subreddit change.
	const match = useRouteMatch("/r/:subreddit");
	let { url } = match;
	const { subreddit } = match.params;
	const history = useHistory();
	const location = useLocation();
	const isExact = match.isExact; // for when back button is press after reloading FocusView and the posts dont get loaded.

	const viewStyle = useViewStyleStore((state) => state.viewStyle);

	const TESTINGMODE = "stack";
	const [afterCode, setAfterCode] = useState("");
	const [dataReceived, setDataReceived] = useState(false);
	// const validModes = ["focus", "stack"];
	const [displayMode, setDisplayMode] = React.useState("");
	const [postsData, setPostsData] = React.useState([]);
	const [permaLinks, setPermaLinks] = React.useState(new Set());
	// comments will be loaded by children components.
	const [comments, setComments] = React.useState([]);
	// const [haveListing, setHaveListings] = useState(false);
	const [postsSeen, setPostsSeen] = React.useState(new Set());
	const [lastSeen, setLastSeen] = React.useState(0);
	const [initPostNo, setInitPostNo] = useState(0);

	// useHotKeys("backspace", () => history.goBack());
	const loadListings = (sub, signal) => {
		const url = `https://www.reddit.com/r/${sub}.json`;
		fetch(url, { signal })
			.then((res) => {
				if (res.status === 200) return res.json();
				// ok so the try-catch cant catch errors thrown in these callbacks hmmm.
				else if (res.status === 403) throw Error("private");
				else if (res.status === 404) throw Error("Not Found");
			})
			.then((json) => {
				let children = json.data.children;
				setPostsData(children);
				let newLinks = children.map((child) => child.data.permalink);
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
				} else if (e.message === "The user aborted a request.") {
					// pass
				} else {
					// Failed to fetch ? huhhh
					// ok i get it when it doesnt find a sub that matches the one in url, it gets redirected to search.
					console.log(e.message);
					history.goBack();
				}
				// but now it makes a new request to get listings each time we enter the wrong sub
			});
	};
	React.useEffect(() => {
		// TODO: USE PERSISTENCE LIBRARY.
		// to avoid fetching all listings of a subreddit when the user only intends to view one. SINGLE PAGE LOAD
		if (!match.isExact) return null;
		setInitPostNo(0); // to fix the weird initPostNo not being reset when opened with click
		// setup AbortController
		const controller = new AbortController();
		// signal to pass to fetch
		const signal = controller.signal;
		try {
			// how do i load the top listings !!??
			loadListings(subreddit, signal);
		} catch (e) {
			alert("useEffect failed");
			console.log(e);
		}
		return () => {
			// why does the sub change when going from StackView to FocusView and then back !!!???
			/* ? this will have to wwait
			// to avoid showing previous sub's listings until new listings load.
			if (isExact) setPostsData([]);
			*/
			// not working rightnow i guess..
			controller.abort();
		};
		// ok so i got it putting isExact in the dependency array was the fix to listings not being loaded
		// after single post load -> history.goBack(), but now it
	}, [subreddit]);

	const findComment = (link) =>
		comments.filter(
			(val) => `https://www.reddit.com${val.link}.json` === link
		);

	const getComments = async (postUrl, cancelSignal) => {
		postUrl = `${postUrl}.json`;
		console.log("URL REQUESTED FOR COMMENTS");
		console.log(postUrl);

		// todo: FIX: find comment is not working
		let foundCom = findComment(postUrl);
		console.log({ foundCom });
		if (foundCom.length !== 0)
			return { comObj: foundCom[0], aborted: false };

		// if comments are not in comments fetch them;
		try {
			const res = await fetch(postUrl, {
				signal: cancelSignal
			});
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

				setPostsData(c[0].data.children); // HERE IS THE ERROR.
				setPermaLinks(new Set([link]));
				// it doesnt load the posts coz of the 1st line in useEffect.
				//? it will take it automatically from the url
				// setSubreddit(c[0].data.children[0].data.subreddit);
				// but if i back now it wont load the posts of the sub we were on.
				// banner.current.setAttribute("dangerouslySetInnerHTML", {}); WONT WORK
				// if subName is null use another state variable for subname set by the getComments def & set true sub on unmount.
			}
			return {
				comObj: comObj,
				data: c[0].data.children[0].data,
				aborted: false
			};
		} catch (e) {
			// ok try to know why it failed
			// wait why did this url even appear here .....
			// todo: inspect the listings obj
			if (e.message === "The user aborted a request.")
				return { aborted: true };
			console.log("got here");
			console.log(e);
			console.log(e.stack);
			alert(postUrl);
			debugger; // could be that there is no such post on subreddit? // http://localhost:3000/r/superstonks/http://reddit.com/r/Superstonk/comments/nlwqyv/house_of_cards_part_3/
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

	const expandView = (postNo) => {
		setInitPostNo(+postNo);
		setDisplayMode("focus");
	};
	// hmmm is passing initPostNo instead of setInitPostNo gonna take more memry ?
	return (
		<div
			className="viewarea"
			data-view-vert={match.isExact ? false : viewStyle}
		>
			{/*should we add a powerbar here to control the view styles etc ?? */}
			<Switch>
				<Route exact path={`/r/:subreddit`}>
					{dataReceived && (
						<StackView
							{...{
								postsData,
								loadMorePosts,
								expandView,
								shouldBlurAll,
								postsSeen,
								lastSeen
							}}
						></StackView>
					)}
				</Route>
				{/*alternatively use useRouteMatch.url or what idk rn */}
				<Route path={`/r/:subreddit/:permalink`}>
					<FocusView
						postsData={postsData}
						getComments={getComments}
						initPostNo={initPostNo}
						viewStyle={viewStyle}
						shouldBlurAll={shouldBlurAll}
						setPostsSeen={setPostsSeen}
						setLastSeen={setLastSeen}
					/>
				</Route>
			</Switch>
		</div>
	);
}
