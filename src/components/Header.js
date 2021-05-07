import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import { makeFriendly } from "./../utils/num.js";

import "./header.css";

export default forwardRef(function Header(
	{ subreddit, setSubreddit, previousSubreddit, subCount },
	banner
) {
	const [selectMenuOpen, setSelectMenuState] = useState(false);
	const toggleSelectMenu = () => setSelectMenuState(!selectMenuOpen);
	const closeSelectMenu = () => setSelectMenuState(false);

	useHotkeys("s", toggleSelectMenu);

	const sel_subreddit = (sub) => {
		closeSelectMenu();
		// change url.
		// sub includes "r/"
		previousSubreddit.current = subreddit;
		setSubreddit(sub.slice(2));
	};

	return (
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
					<p className="banner" ref={banner}>
						r/{subreddit}
					</p>
					{![null, NaN, undefined].some((v) =>
						Object.is(subCount, v)
					) && (
						<p className="members" title={subCount}>
							{makeFriendly(subCount)} members
						</p>
					)}
				</span>
				{/* yup nice now i just need to know a good way to make forms in react! THIS SHOULD BE ITS OWN COMPONENT TODO: ADD FOCUS ON USEFFECT*/}
				{selectMenuOpen && (
					// NICE  better way to pass props
					<SubredditSelect
						{...{ sel_subreddit, subreddit, closeSelectMenu }}
					></SubredditSelect>
				)}
			</span>
		</header>
	);
});

const SubredditSelect = ({ sel_subreddit, subreddit, closeSelectMenu }) => {
	const subSel = useRef();
	const history = useHistory();
	console.log(history);
	const [inputSub, setInputSub] = useState(`r/${subreddit}`);

	// focus on mount and auto close of out click.
	useEffect(() => {
		subSel.current.focus();
		const watch = (e) => e.target !== subSel.current && closeSelectMenu();
		document.addEventListener("click", watch);

		return () => {
			document.removeEventListener("click", watch);
		};
	}, []);

	const onSubSelect = (inputSub) => {
		history.push("/");
		sel_subreddit(inputSub);
	};

	return (
		<div className="sub-sel">
			<input
				ref={subSel}
				value={inputSub}
				onKeyDown={(e) => e.key === "Enter" && onSubSelect(inputSub)}
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
