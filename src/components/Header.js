import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import { makeFriendly } from "./../utils/num.js";

import "./header.css";

export default function Header({ previousSubreddit, subCount }) {
	const { subreddit } = useParams();
	const history = useHistory();
	const [selectMenuOpen, setSelectMenuState] = useState(false);
	const toggleSelectMenu = () => setSelectMenuState(!selectMenuOpen);
	const closeSelectMenu = () => setSelectMenuState(false);

	useHotkeys("s", toggleSelectMenu);

	const sel_subreddit = (sub) => {
		closeSelectMenu();
		// change url.
		// sub includes "r/"
		previousSubreddit.current = subreddit;
		history.push("/" + sub.slice(2));
		// setSubreddit(sub.slice(2));
	};

	return (
		<>
			<header>
				{/*welcome to The Open Source reddit client focused on browsing{" "}*/}
				<span>
					<span onClick={toggleSelectMenu}>
						<img
							src="https://styles.redditmedia.com/t5_2szyo/styles/communityIcon_x3ag97t82z251.png?width=256&s=33531dceba6466953aadef3073f36cfc2e267175"
							alt="showerthoughts subreddit logo"
							width="50px"
							height="50px"
						/>
						<p className="banner">r/{subreddit}</p>
					</span>
					{![null, NaN, undefined].some((v) =>
						Object.is(subCount, v)
					) && (
						<p className="members" title={subCount}>
							{makeFriendly(subCount)} members
						</p>
					)}
				</span>
			</header>
			{/* yup nice now i just need to know a good way to make forms in react! THIS SHOULD BE ITS OWN COMPONENT TODO: ADD FOCUS ON USEFFECT*/}
			{selectMenuOpen && (
				// NICE  better way to pass props
				<SubredditSelect
					{...{ sel_subreddit, subreddit, closeSelectMenu }}
				></SubredditSelect>
			)}
		</>
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
