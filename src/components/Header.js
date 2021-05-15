import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import { makeFriendly } from "./../utils/num.js";

import {VscColorMode} from "react-icons/vsc";

import "./header.css";

/*
--primary: #edf6f9;
--text: #1c1412;
--bg: #1d1f21;
--fg: #C5C8C6;
*/
const r = document.querySelector(':root');
const bgLight = "#edf6f9";
const fgLight = "#1c1412";
const bgDark = "#1d1f21";
const fgDark = "#C5C8C6";

export default function Header() {
	const { subreddit } = useParams();
	const history = useHistory();
	const [selectMenuOpen, setSelectMenuState] = useState(false);
	const toggleSelectMenu = () => setSelectMenuState(!selectMenuOpen);
	const closeSelectMenu = () => setSelectMenuState(false);

	const sel_subreddit = (sub) => {
		closeSelectMenu();
		// sub includes "r/"
		history.push("/" + sub.slice(2));
	};

	const [imgSrc, setImgSrc] = useState(null);
	const [subCount, setSubCount] = useState();
	const [active, setActiveCount] = useState();
	const [desc, setDesc] = useState();
	const img = useRef();

	useHotkeys("shift + p", toggleSelectMenu);

	// get the info about the subreddit. do when sub changes.
	useEffect(() => {
		// reset img display because some subreddit's icons may not load.
		img.current.setAttribute("style", "display: none;")
		// sub_info: https://www.reddit.com/dev/api/#GET_r_{subreddit}_about
		// data.public_description, header_img, allow_galleries, wiki_enabled, active_user_count, icon_img
		// allow_videos, submission_type, created, spoilers_enabled, over18
		fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
			.then((res) => res.json())
			.then(({ data }) => {
				// sometimes there is no icon_img
				// shit 403 on data.community_icon
				setImgSrc(data?.icon_img || data?.community_icon);
				setSubCount(data?.subscribers);
				setActiveCount(data?.active_user_count);
				setDesc(data?.public_description)
				// todo: dont show the icon if we cant load it.
			});
	}, [subreddit]);
	// todo: public_description_html vs public_description

	const toggleTheme = () => {
		const rs = getComputedStyle(r);
		const primary = rs.getPropertyValue('--primary');
		const text = rs.getPropertyValue('--text');

		if (primary === bgLight && text === fgLight) {		
			r.style.setProperty('--primary', bgDark);
			r.style.setProperty('--text', fgDark);
		} else {
			r.style.setProperty('--primary', bgLight);
			r.style.setProperty('--text', fgLight);
		}
	}

	useHotkeys("t", toggleTheme);

	return (
		<header>
			{/*welcome to The Open Source reddit client focused on browsing{" "}*/}
			<span>
				<span onClick={toggleSelectMenu} title={desc}>
					<img
						src={imgSrc}
						alt="subreddit logo"
						width="50px"
						height="50px"
						style={{display:"none"}}
						ref={img}
						onLoad={()=>img.current.setAttribute("style", "display: inline-block;")}
					/>
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
			<span className="theme-switch">
				<VscColorMode onClick={toggleTheme}/>
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
