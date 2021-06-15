// https://avatars.githubusercontent.com/HarshitJoshi9152
import React, { useEffect, useRef, useState } from "react";
// hooks
import { useHistory, useParams, Link, useRouteMatch } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

// components
import RightNav from "./rightNav.js";
// import Loader from "react-loader";
import { Img } from "react-image";

// stores
import { useKeyMappings } from "./../stores/keymappings.js";

// util functions.
import { makeFriendly } from "./../utils/num.js";

// css
import "./header.css";
import "./Notice.css";

/*
--primary: #edf6f9;
--text: #1c1412;
--bg: #1d1f21;
--fg: #C5C8C6;
todo: add seen var switch
*/
const r = document.querySelector(":root");
const bgLight = "#edf6f9";
const fgLight = "#1c1412";
const bgDark = "#1d1f21";
const fgDark = "#C5C8C6";
const linkDark = "#c200c1";

export default function Header() {
	const { subreddit } = useParams();
	const history = useHistory();
	const match = useRouteMatch();
	const [imgSrc, setImgSrc] = useState(null);
	const [subCount, setSubCount] = useState();
	const [active, setActiveCount] = useState();
	const [desc, setDesc] = useState();
	const [displayName, setDisplayName] = useState(null);
	const [title, setTitle] = useState(null);
	const img = useRef();
	const [loaded, setLoaded] = useState(false);
	const [askPermissionToBrowse, setAskPermissionToBrowse] = useState(false);

	const [hidden, setHidden] = useState(false);
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
	// back to the old ways !
	// setting the css variables to change appearance on theme change.
	useEffect(() => {
		if (theme === "dark") {
			r.style.setProperty("--primary", bgDark);
			r.style.setProperty("--text", fgDark);
			r.style.setProperty("--link", linkDark);
		} else if (theme === "light") {
			r.style.setProperty("--primary", bgLight);
			r.style.setProperty("--text", fgLight);
			r.style.setProperty("--link", "blue");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () =>
		setTheme((t) => (t === "dark" ? "light" : "dark"));

	// #region getting shortcuts mapping
	const hideHeaderKeys = useKeyMappings((s) => s.hideHeaderKeys);
	const toggleThemeKeys = useKeyMappings(
		(s) => s.toggleThemeKeys
	);
	// #endregion

	useHotkeys(hideHeaderKeys, () => {
	// useHotkeys("h", () => {
		setHidden((h) => !h);
	});
	useHotkeys(toggleThemeKeys, toggleTheme);

	// check localStorage or JWT for default value.
	const [loggedIn, setLoggedIn] = useState(false);

	// why cant i use this here ?
	// useHotKeys("ctrl + /", () => alert("show all keyboard shortcuts"))
	// get the info about the subreddit. do when sub changes.
	useEffect(() => {
		// sub_info: https://www.reddit.com/dev/api/#GET_r_{subreddit}_about
		// data.public_description, header_img, allow_galleries, wiki_enabled, active_user_count, icon_img
		// allow_videos, submission_type, created, spoilers_enabled, over18
		fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
			.then((res) => {
				if (!res.ok) {
					// {data} is undefined in this case.
					throw Error("Not Found");
				} else {
					return res.json();
				}
			})
			.then(({ data }) => {
				// sometimes there is no icon_img
				// shit 403 on data.community_icon
				setImgSrc(data?.icon_img || data?.community_icon);
				setSubCount(data?.subscribers);
				setActiveCount(data?.active_user_count);
				setDesc(data?.public_description);
				setLoaded(true);
				setAskPermissionToBrowse(data?.over18);
				setDisplayName(data?.display_name);
				setTitle(data?.title);
				// handle over18 in such a way that the postsData doesnt have to be loaded
				// todo: dont show the icon if we cant load it.
			})
			.catch((e) => {
				console.log("Header", e.message);
				if (e.message === "Not Found") {
					//
				}
			});
		return () => {
			// reset on sub change
			setLoaded(false);
			setDesc("");
			setSubCount(null);
			setActiveCount(null);
			setAskPermissionToBrowse(false);
			setDisplayName(null);
			setTitle(null);
			// do i really need to do this ? not really tho
			// setImgSrc("");
		};
	}, [subreddit]);
	// todo: public_description_html vs public_description

	const toggleInfo = () => {
		alert("niuce");
	};

	if (askPermissionToBrowse) {
		return <Notice {...{ setAskPermissionToBrowse, subreddit }} />;
	}

	if (hidden) return <></>;

	return (
		<header>
			{/*welcome to The Open Source reddit client focused on browsing{" "}*/}
			<span>
				<span
					onClick={() => {
						if (!match.isExact) history.push("/r/" + subreddit);
					}}
					title={`${title}\n${desc}`}
				>
					{loaded && <Img className="sub-icon" src={imgSrc} />}
					<p className="banner">
						{`r/${displayName ? displayName : subreddit}`}
					</p>
				</span>
				{![null, NaN, undefined].some((v) =>
					Object.is(subCount, v)
				) && (
					<>
						<p className="members" title={`${subCount} members`}>
							{makeFriendly(subCount)} members
						</p>
						<p className="members" title={`${active} online`}>
							{makeFriendly(active)} online
						</p>
					</>
				)}
				{/*<span className="desc">
					{desc}
				</span>*/}
				{/* yup nice now i just need to know a good way to make forms in react! THIS SHOULD BE ITS OWN COMPONENT TODO: ADD FOCUS ON USEFFECT*/}
			</span>
			<RightNav {...{ toggleTheme, toggleInfo, loggedIn, setLoggedIn }} />
		</header>
	);
}

const Notice = ({ subreddit, setAskPermissionToBrowse }) => {
	const history = useHistory();

	return (
		<div className="notice">
			<div className="cont">
				<h1>
					r/{subreddit} is marked as{" "}
					<span title="not safe for work">NSFW</span>
				</h1>
				<h2>Are you sure you want to browse it ?</h2>
				<button onClick={() => setAskPermissionToBrowse(false)}>
					Yes
				</button>
				<button onClick={() => history.goBack()}>No</button>
			</div>
		</div>
	);
};
