// https://avatars.githubusercontent.com/HarshitJoshi9152
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams, Link} from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import Loader from "react-loader";
import {Img} from 'react-image';

import {VscColorMode, VscInfo, VscGithubInverted, VscAccount, VscSettingsGear} from "react-icons/vsc";

import { makeFriendly } from "./../utils/num.js";
import "./header.css";

const repoLink = "https://github.com/HarshitJoshi9152/showerthoughts";

/*
--primary: #edf6f9;
--text: #1c1412;
--bg: #1d1f21;
--fg: #C5C8C6;
todo: add seen var switch
*/
const r = document.querySelector(':root');
const bgLight = "#edf6f9";
const fgLight = "#1c1412";
const bgDark = "#1d1f21";
const fgDark = "#C5C8C6";

const iconStyle = {
		width: "32px",
		height: "32px",
		margin: "0px 8px 0px 8px"
};

const toggleTheme = () => {
		const rs = getComputedStyle(r);
		const primary = rs.getPropertyValue('--primary');
		const text = rs.getPropertyValue('--text');

		// alert(primary);
		// alert(text);

		// todo: why does this not work on the first try ?
		if (primary === bgLight && text === fgLight) {
			// even tho it seems to be true (not actually) this doesnt seem to be triggered
			r.style.setProperty('--primary', bgDark);
			r.style.setProperty('--text', fgDark);
		} else {
			// for 1st try because it is in light mode by default.
			// todo: wont work after customisations tho lol
			r.style.setProperty('--primary', bgLight);
			r.style.setProperty('--text', fgLight);
		}
		// else if (primary === bgDark && text === fgDark){
		// 	r.style.setProperty('--primary', bgLight);
		// 	r.style.setProperty('--text', fgLight);
		// } 
}

// for 1st try it doesnt work, but it does after that so.
// todo: wont work after customisations tho lol
toggleTheme()

export default function Header() {
	const { subreddit } = useParams();
	const history = useHistory();
	const [selectMenuOpen, setSelectMenuState] = useState(false);
	const toggleSelectMenu = () => setSelectMenuState(!selectMenuOpen);
	const closeSelectMenu = () => setSelectMenuState(false);

	const sel_subreddit = (sub) => {
		closeSelectMenu();
		// sub includes "r/"
		if (subreddit === sub.slice(2)) {
			alert("same sub wont change history")
			return null;
		}
		history.push("/" + sub.slice(2));
	};

	const [imgSrc, setImgSrc] = useState(null);
	const [subCount, setSubCount] = useState();
	const [active, setActiveCount] = useState();
	const [desc, setDesc] = useState();
	const img = useRef();
	const [loaded, setLoaded] = useState(false);
	useHotkeys("shift + p", toggleSelectMenu);
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
				}
				else {
					return res.json()
				}
			})
			.then(({ data }) => {
				// sometimes there is no icon_img
				// shit 403 on data.community_icon
				setImgSrc(data?.icon_img || data?.community_icon);
				setSubCount(data?.subscribers);
				setActiveCount(data?.active_user_count);
				setDesc(data?.public_description)
				setLoaded(true);
				// todo: dont show the icon if we cant load it.
			})
			.catch((e) => {
				console.log("Header", e.message);
				if(e.message === "Not Found") {
					// 
				};
			})
		return () => {
			// reset on sub change
			setLoaded(false);
			setDesc("");
			setSubCount(null);
			setActiveCount(null);
			// do i really need to do this ? not really tho
			// setImgSrc("");
		}
	}, [subreddit]);
	// todo: public_description_html vs public_description

	const toggleInfo = () => {
		alert("niuce")
	}

	useHotkeys("t", toggleTheme);

	return (
		<header>
			{/*welcome to The Open Source reddit client focused on browsing{" "}*/}
			<span>
				<span onClick={toggleSelectMenu} title={desc}>
					{loaded && <Img className="sub-icon" src={imgSrc} />}
					<p className="banner">r/{subreddit}</p>
				</span>
				{![null, NaN, undefined].some((v) =>
					Object.is(subCount, v)
				) && (
					<>
					<p className="members" title={subCount}>
						{makeFriendly(subCount)} members
					</p>
					<p className="members" title={active}>
						{makeFriendly(active)} active
					</p>
					</>
				)}
				{/*<span className="desc">
					{desc}
				</span>*/}
				{/* yup nice now i just need to know a good way to make forms in react! THIS SHOULD BE ITS OWN COMPONENT TODO: ADD FOCUS ON USEFFECT*/}
				{selectMenuOpen && (
					// NICE  better way to pass props
					<SubredditSelect
						{...{ sel_subreddit, subreddit, closeSelectMenu }}
					></SubredditSelect>
				)}
			</span>
			<span className="right">
				<VscAccount style={iconStyle} title="Login"/>
				<VscSettingsGear style={iconStyle} title="Login"/>
				<span className="theme-switch">
					<VscColorMode style={iconStyle} onClick={toggleTheme}/>
				</span>
				<span className="info">
					<VscInfo style={iconStyle} onClick={toggleInfo}/>
				</span>
				<a href={repoLink} target="_blank" rel="noreferrer" className="repo-link">
					<VscGithubInverted style={iconStyle} title={repoLink}/>
				</a>
			</span>
		</header>
	);
}

const SubredditSelect = ({ sel_subreddit, subreddit, closeSelectMenu }) => {
	// todo: add auto complete and make it a full power menu.
	const subSel = useRef();
	const history = useHistory();
	const [inputSub, setInputSub] = useState(`r/${subreddit}`);

	// idk why but this doesnt work when the input field is focused.
	// https://github.com/greena13/react-hotkeys/issues/100
	// useHotkeys("escape", () => {
	// 	alert("escape");
	// 	closeSelectMenu();
	// });

	// focus on mount and auto close of out click.
	useEffect(() => {
		subSel.current.focus(); // we dont want the user to be scrolled to the top against his wishes.
		const watch = (e) => e.target !== subSel.current && closeSelectMenu();
		document.addEventListener("click", watch);

		return () => {
			document.removeEventListener("click", watch);
		};
	}, []);

	return (
		<div className="sub-sel">
			<input
				ref={subSel}
				value={inputSub}
				onKeyDown={(e) => {
					e.key === "Enter" && sel_subreddit(inputSub);
					if (e.key === "Escape") {
						subSel.current.blur();
						closeSelectMenu();
					}
				}}
				onChange={(e) => {
					let val = e.target.value;
					if (["r", "/", ""].includes(val)) val = "r/";
					setInputSub(val);
				}}
				placeholder={`r/${subreddit}`}
			/>
		</div>
	);
};