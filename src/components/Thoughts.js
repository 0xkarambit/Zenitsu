import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
// import Speech from "react-speech";
import { useHotkeys } from "react-hotkeys-hook";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

// styling
import "./thoughts.css";
import "./helpmenu.css";
// components
import FocusView from "./FocusView.js";
import StackView from "./StackView.js";
import { SubredditSelect } from "./SubSel.js";
// stores
import { useViewStyleStore } from "./../stores/viewStyle.js";
import { useCommentsStore } from "./../stores/commentsStore.js";
import { useKeyMappings } from "./../stores/keymappings.js";

// icons
import { VscSettingsGear } from "react-icons/vsc";

export default function Thoughts({ shouldBlurAll }) {
	// the displayMode gets set to $TESTINGMODE after every subreddit change.
	const match = useRouteMatch("/r/:subreddit");
	// useMemo
	const subreddit = useMemo(
		() => match.params.subreddit,
		[match.params.subreddit]
	);
	const history = useHistory();
	const viewStyle = useViewStyleStore((state) => state.viewStyle);

	const [afterCode, setAfterCode] = useState("");
	const [dataReceived, setDataReceived] = useState(false);
	// const validModes = ["focus", "stack"];
	const [displayMode, setDisplayMode] = React.useState("");
	const [postsData, setPostsData] = React.useState([]);
	const [permaLinks, setPermaLinks] = React.useState(new Set());
	// comments will be loaded by children components.
	// const [comments, setComments] = React.useState([]);
	const { addComment, findComment, clearComments } = useCommentsStore();
	// const [haveListing, setHaveListings] = useState(false);
	const [postsSeen, setPostsSeen] = React.useState(new Set());
	const [lastSeen, setLastSeen] = React.useState(0);
	const [loaded, setLoaded] = useState(false);
	const initPostNo = useRef(0);

	const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

	const [dStyle, setDStyle] = useState("stack"); // stack, imgOnly.

	// #region
	const [showKeyMappingsKeys, imgOnlyModeKeys, subSelKeys] = useKeyMappings(
		(s) => [s.showKeyMappingsKeys, s.imgOnlyModeKeys, s.subSelKeys]
	);
	// #endregion

	useHotkeys(imgOnlyModeKeys, () =>
		setDStyle((s) => (s === "imgOnly" ? "stack" : "imgOnly"))
	);

	const loadListings = (sub, signal) => {
		if (loaded) return null;
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
				setLoaded(true);
			})
			.catch((e) => {
				// todo: add msg for community doesnt exist 404
				if (e.message === "private") {
					alert("cannot browse private community");
					history.goBack();
				} else if (e.message === "Not Found") {
					alert("no such community exists");
					history.goBack();
				} else if (e.message === "The user aborted a request.") {
					// pass
				} else {
					// Failed to fetch ? huhhh
					// ok i get it when it doesnt find a sub that matches the one in url, it gets redirected to search.
					console.log(e.message);
					history.goBack();
				}
			});
	};

	React.useEffect(() => {
		console.log("SUB CHANGED", { subreddit });
		// TODO: USE PERSISTENCE LIBRARY.
		// to avoid fetching all listings of a subreddit when the user only intends to view one. SINGLE PAGE LOAD
		if (loaded) return null;
		if (!match.isExact) return null; // might be useless now NO
		// setup AbortController
		const controller = new AbortController();
		const signal = controller.signal;
		try {
			// how do i load the top listings !!??
			// console.log("tfsdhsdljsakj");
			// console.log(postsData.length);
			// console.log({ postsData });
			console.log("called FROM HERE ?");
			loadListings(subreddit, signal);
			// loadListings(subreddit, signal);
		} catch (e) {
			alert("useEffect failed");
			console.log(e);
		}
		return () => {
			// why does the sub change when going from StackView to FocusView aond then back !!!???
			/* ? this will have to wwait
			// to avoid showing previous sub's listings until new listings load.
			if (isExact) setPostsData([]);
			*/
			// not working rightnow i guess..
			// make this state/ref ig..
			controller.abort();
			// FUCK clear comments too

			// becuase permalinks are not cleared in `BACKSPACE`;
		};
		// ok so i got it putting isExact in the dependency array was the fix to listings not being loaded
		// after single post load -> history.goBack(), but now it
	}, [subreddit, loaded, match.isExact]);
	// should i add isExact or use the button's load me thing ?

	useEffect(() => {
		return () => {
			// why does the sub change when going from StackView to FocusView and then back !!!???
			/* ? this will have to wwait
			// to avoid showing previous sub's listings until new listings load.
			if (isExact) setPostsData([]);
			*/
			// not working rightnow i guess..
			// FUCK clear comments too
			// alert("CLEAREDDDDdasd");
			clearComments();
			initPostNo.current = 0; // to fix the weird initPostNo not being reset when opened with click
			setPostsData([]);
			setPermaLinks(new Set());
			setLoaded(false);
			setAfterCode("");
			console.log("loaded: ", loaded);
		};
	}, [subreddit]);

	const getComments = useCallback(
		async (postUrl, cancelSignal) => {
			postUrl = `${postUrl}.json`;
			let foundCom = findComment(postUrl);
			if (foundCom) return { comObj: foundCom, aborted: false };
			console.info("comment not found in cache");
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
				// setComments((coms) => [...coms, comObj]);
				addComment(comObj);
				// check if postData is there for the post requested in postUrl.
				// ya ok so the state doesnt get cleared right away.
				console.info({ permaLinks });
				console.info("CLAAEED adns ", postsData.length === 0);
				console.info({ postsData });
				console.info(postsData.length === 0);
				// getComments is still not good enough.
				// it works very weirdly ig in combination with the setTimeout
				if (postsData.length === 0) {
					// postData did not already exist for this meaning that its a SINGLE POST LOAD from the url.
					console.log(
						"postData did not already exist for this meaning that its a SINGLE POST LOAD from the url."
					);
					console.log({ permaLinks });
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
				if (
					e.message === "The user aborted a request." ||
					e.message ===
						"Failed to execute 'fetch' on 'Window': The user aborted a request."
				)
					return { aborted: true };
				console.log("got here");
				console.log(e);
				console.log(e.stack);
				alert(postUrl);
				debugger; // could be that there is no such post on subreddit? // http://localhost:3000/r/superstonks/http://reddit.com/r/Superstonk/comments/nlwqyv/house_of_cards_part_3/
				return 1;
			}
		},
		[postsData, permaLinks]
	);

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
		initPostNo.current = +postNo;
		setDisplayMode("focus");
	};
	// hmmm is passing initPostNo instead of setInitPostNo gonna take more memry ?

	//  toggle the show key mappings.
	useHotkeys(showKeyMappingsKeys, () =>
		setShowKeyboardShortcuts((show) => !show)
	);

	// code for SubredditSelectior.
	// #region
	const [selectMenuOpen, setSelectMenuState] = useState(false);
	const toggleSelectMenu = () => setSelectMenuState(!selectMenuOpen);
	const closeSelectMenu = () => setSelectMenuState(false);

	useHotkeys(subSelKeys, toggleSelectMenu);

	const sel_subreddit = (sub) => {
		closeSelectMenu();
		if (subreddit === sub.slice(2).toLowerCase()) return null;
		// sub includes "r/"
		history.push("/r/" + sub.slice(2).toLowerCase());
		// todo: get rid of the slice use the input value margin left we saw on stackOverflow the other day.
	};
	// #endregion
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
								lastSeen,
								loadListings,
								clearComments,
								setPostsData,
								setPermaLinks,
								loaded,
								dStyle
							}}
						/>
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
						expandView={expandView}
						loadListings={loadListings}
						loaded={loaded}
						dStyle={dStyle}
					/>
				</Route>
			</Switch>
			{showKeyboardShortcuts && (
				<HelpMenu closePopup={() => setShowKeyboardShortcuts(false)} />
			)}
			{selectMenuOpen && (
				<SubredditSelect
					{...{ sel_subreddit, subreddit, closeSelectMenu }}
				/>
			)}
		</div>
	);
}

// const keyMappings = {
// 	"ctrl + shift + b": "toggle blurring over18 content.",
// 	backspace: "go back",
// 	g: "scroll to top",
// 	"shift + /": "show keymappings menu",
// 	// FOCUS VIEW
// 	v: "toggle vert-split view",
// 	"n, p": "scroll to next, previous post",
// 	"shift + n,p": "gallery next, previous",
// 	"ctrl + b": "blur/unblur current img in focus mode",
// 	t: "toggle light & dark themes",
// 	"/": "search/select sub",
// 	l: "login with reddit",
// 	m: "load more listings",
// 	h: "hide sub header",
// 	i: "toggle imgOnly mode"
// };

const keyMappingsByCategory = {
	General: {
		"ctrl + shift + b": {
			desc: "toggle blurring over18 content.",
			code: "over18ContentBlurKeys"
		},
		backspace: {
			desc: "go back",
			code: "goBackKeys"
		},
		g: {
			desc: "scroll to top",
			code: "scrollToTopKeys"
		},
		"shift + /": {
			desc: "show keymappings menu",
			code: ""
		},
		t: {
			desc: "toggle light & dark themes",
			code: ""
		},
		"/": {
			desc: "search/select sub",
			code: ""
		},
		l: {
			desc: "login with reddit",
			code: ""
		},
		h: {
			desc: "hide sub header",
			code: "hideHeaderKeys"
		},
		i: {
			desc: "toggle imgOnly mode",
			code: ""
		}
	},
	FocusView: {
		v: {
			desc: "toggle vert-split view",
			code: ""
		},
		"n, p": {
			desc: "scroll to next, previous post",
			code: ""
		},
		"shift + n, shift + p": {
			desc: "gallery next, previous",
			code: ""
		},
		"ctrl + b": {
			desc: "blur/unblur current img in focus mode",
			code: ""
		}
	},
	StackView: {
		m: {
			desc: "load more listings",
			code: ""
		},
		r: {
			desc: "Update grid Layout",
			code: ""
		},
		s: {
			desc: "start slideshow",
			code: ""
		},
		"shift + =": {
			desc: "increase img sizes in imgOnly mode",
			code: ""
		},
		"shift + -": {
			desc: "decrease img sizes in imgOnly mode",
			code: ""
		}
	}
};

// const HelpMenuOriginal = ({ closePopup }) => {
// 	useHotkeys("escape", closePopup);

// 	return (
// 		// <div className="blur-bg">
// 		<div className="" id="#over">
// 			<div className="overlay">
// 				<h2>Keyboard Shortcuts</h2>
// 				<table className="shortcuts center">
// 					<tr>
// 						<th>Result</th>
// 						<th>KeyMapping</th>
// 					</tr>
// 					{Object.keys(keyMappings).map((key) => {
// 						return (
// 							<tr>
// 								<td>{keyMappings[key]}</td>
// 								<td>
// 									<strong>
// 										<code>{key}</code>
// 									</strong>
// 								</td>
// 							</tr>
// 						);
// 					})}
// 				</table>
// 			</div>
// 		</div>
// 		// </div>
// 	);
// };

const HelpMenu = ({ closePopup }) => {
	const icon = {
		float: "right",
		cursor: "pointer",
		margin: "0.2rem 1rem 0rem 0rem"
	};

	const [editMode, setEditMode] = useState(false);
	const toggleEditMode = () => setEditMode((m) => !m);

	useHotkeys("escape", closePopup);
	useHotkeys("shift + s", toggleEditMode);

	return (
		// <div className="blur-bg">
		<div className="" id="#over">
			<div className="overlay">
				<h2>
					Keyboard Shortcuts
					<VscSettingsGear
						style={icon}
						onClick={toggleEditMode}
						title="change shorcuts"
					/>
				</h2>
				<div className="overlay-grid">
					{Object.keys(keyMappingsByCategory).map((cat) => {
						return (
							<div
								id={cat}
								className={`overlay-grid-child ${cat} center`}
							>
								<h2>{cat}</h2>
								<table className="shortcuts center">
									<tr>
										<th>Result</th>
										<th>KeyMapping</th>
									</tr>
									{Object.keys(
										keyMappingsByCategory[cat]
									).map((key) => {
										return (
											<tr>
												<td>
													{
														keyMappingsByCategory[
															cat
														][key].desc
													}
												</td>
												<td>
													{editMode &&
													cat !== "FocusView" ? (
														<KeyMapInput
															keys={key}
															desc={
																keyMappingsByCategory[
																	cat
																][key].desc
															}
															code={
																keyMappingsByCategory[
																	cat
																][key].code
															}
														/>
													) : (
														<strong>
															<code>{key}</code>
														</strong>
													)}
												</td>
											</tr>
										);
									})}
								</table>
							</div>
						);
					})}
				</div>
			</div>
		</div>
		// </div>
	);
};

const KeyMapInput = ({ keys, desc, code }) => {
	const input = useRef();

	const setKeyMapping = useKeyMappings((s) => s.setKeyMapping);
	const [val, setVal] = useState(keys);

	const setShortCut = () => {
		setKeyMapping(code, val);
		return true;
	};

	return (
		<input
			className="keys-input"
			value={val}
			ref={input}
			// ! but we cant use Enter_key, Arrows like this.
			onChange={(e) => {
				setVal(e.target.value);
			}}
			onKeyDown={(e) => {
				e.key === "Enter" &&
					setShortCut() &&
					alert(`${code} updated !`);
				e.key === "Escape" && input.current.blur();
			}}
		/>
	);
};
