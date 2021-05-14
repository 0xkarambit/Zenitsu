import React, { useEffect, useRef, useState } from "react";
// import Speech from "react-speech";
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

export default function Thoughts({ viewStyle, shouldBlurAll }) {
	// the displayMode gets set to $TESTINGMODE after every subreddit change.
	const match = useRouteMatch("/:subreddit");
	const { subreddit } = match.params;
	const history = useHistory();
	const location = useLocation();
	const isExact = match.isExact; // for when back button is press after reloading FocusView and the posts dont get loaded.

	const TESTINGMODE = "stack";
	const [afterCode, setAfterCode] = useState("");
	let [dataReceived, setDataReceived] = useState(false);
	// const validModes = ["focus", "stack"];
	const [displayMode, setDisplayMode] = React.useState("");
	const [postsData, setPostsData] = React.useState([]);
	const [permaLinks, setPermaLinks] = React.useState(new Set());
	// comments will be loaded by children components.
	const [comments, setComments] = React.useState([]);
	// const [haveListing, setHaveListings] = useState(false);

	const loadListings = (sub) => {
		const url = `https://www.reddit.com/r/${sub}.json`;
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
				} else {
					// Failed to fetch ? huhhh
					// ok i get it when it doesnt find a sub that matches the one in url, it gets redirected to search.
					console.log(e.message);
				}
				// but now it makes a new request to get listings each time we enter the wrong sub
				history.goBack();
			});
	};
	// setTimeout(() => {
	// 	console.log({ haveListing });
	// }, 5000);
	// fetching the data on mount;
	React.useEffect(() => {
		// ? THIS doesn't get triggered if we get back from a Single page post load. coz sub has not changed and component has not remounted.
		// ? wait use post unmount.
		// to avoid fetching all listings of a subreddit when the user only intends to view one. SINGLE PAGE LOAD
		if (!match.isExact) {
			// console.log("NOT EXACT NOT ");
			// console.log({ match });
			// console.log({ subreddit });
			// console.log({ location });
			return null;
		}
		// const url = "https://www.reddit.com/r/Showerthoughts/top/?t=month";
		// by default .json at the end pulls the hot listings
		// is this try-catch useless lol.
		setTimeout(() => {
			console.log("USE EFFECT CALLLEEDDDDD");
		}, 5000);
		try {
			// how do i load the top listings !!??
			loadListings(subreddit);
		} catch (e) {
			alert("useEffect failed");
			console.log(e);
		}
		return () => {
			// idont think this function get called ever now.
			// too bad i would have put setHaveListings(false) in here.
			// ? wait i see this console.log so it means that this component gets unMounted on every sub change ?
			// ? and also on Focus post View wow why.
			// ? ok so its because of react router. https://stackoverflow.com/questions/33431319/prevent-component-be-unmounted-with-react-router/38477462, https://stackoverflow.com/questions/45917133/react-router-never-unmount-a-component-on-a-route-once-mounted-even-if-route-c#:~:text=20-,React%2Drouter%3A%20never%20unmount%20a%20component%20on%20a%20route%20once,mounted%2C%20even%20if%20route%20change&text=Where%20basically%20each%20component%20is%20mounted%2Funmounted%20on%20route%20change.
			// ? is it tho idk shit.
			// setPostsData([]);
		};
	}, [subreddit, isExact]);

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
		if (foundCom.length !== 0) return { comObj: foundCom[0] };

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

				setPostsData(c[0].data.children); // HERE IS THE ERROR.
				setPermaLinks(new Set([link]));
				alert("triggered");
				// it doesnt load the posts coz of the 1st line in useEffect.
				//? it will take it automatically from the url
				// setSubreddit(c[0].data.children[0].data.subreddit);
				// but if i back now it wont load the posts of the sub we were on.
				// banner.current.setAttribute("dangerouslySetInnerHTML", {}); WONT WORK
				// if subName is null use another state variable for subname set by the getComments def & set true sub on unmount.
			}
			return { comObj: comObj, data: c[0].data.children[0].data };
		} catch (e) {
			// ok try to know why it failed
			// wait why did this url even appear here .....
			// todo: inspect the listings obj
			console.log("got here");
			console.log(e);
			console.log(e.stack);
			alert(postUrl);
			debugger;
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
		<div
			className="viewarea"
			data-view-vert={displayMode === "stack" ? null : viewStyle}
		>
			{/*should we add a powerbar here to control the view styles etc ?? */}
			<Switch>
				<Route exact path="/:subreddit">
					{dataReceived && (
						<>
							<StackGrid
								monitorImagesLoaded={true}
								columnWidth={300}
							>
								{postsData.map((post, i) => (
									<Link
										to={`/${subreddit}/https://www.reddit.com${post.data.permalink}`}
										style={{ textDecoration: "none" }}
									>
										<Post
											key={i}
											index={i}
											{...post.data}
											expandView={expandView}
											shouldBlurAll={shouldBlurAll}
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
				{/*alternatively use useRouteMatch.url or what idk rn */}
				<Route path={`/${subreddit}/:permalink`}>
					<FocusView
						postsData={postsData}
						getComments={getComments}
						initPostNo={initPostNo}
						viewStyle={viewStyle}
						shouldBlurAll={shouldBlurAll}
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
