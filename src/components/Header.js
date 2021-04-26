import React, { useEffect, useRef, useState } from "react";
import "./header.css";

import constructionSign from "./../assets/icons/construction.svg";

const icon = {
	width: "32px",
	height: "32px",
	color: "white"
};

export default function Header({ subreddit, setSubreddit, previousSubreddit }) {
	const [selectMenuOpen, setSelectMenuState] = useState(false);

	const toggleSelectMenu = () => setSelectMenuState(!selectMenuOpen);
	const closeSelectMenu = () => setSelectMenuState(false);

	const sel_subreddit = (sub) => {
		closeSelectMenu();
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
					<p className="banner">r/{subreddit}</p>
				</span>
				{/* yup nice now i just need to know a good way to make forms in react! THIS SHOULD BE ITS OWN COMPONENT TODO: ADD FOCUS ON USEFFECT*/}
				{selectMenuOpen && (
					// NICE  better way to pass props
					<SubredditSelect
						{...{ sel_subreddit, subreddit, closeSelectMenu }}
					></SubredditSelect>
				)}
			</span>
			{/* SITE STILL IN DEVELOPMENT NOTICE */}
			<NOTICE />
		</header>
	);
}

const SubredditSelect = ({ sel_subreddit, subreddit, closeSelectMenu }) => {
	const subSel = useRef();
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

	return (
		<div className="sub-sel">
			<input
				ref={subSel}
				value={inputSub}
				onKeyDown={(e) => e.key === "Enter" && sel_subreddit(inputSub)}
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

function NOTICE() {
	return (
		<span
			style={{
				marginLeft: "10px",
				// backgroundColor: "#ffc861",
				color: "#2f4360",
				borderRadius: "10px"
			}}
		>
			<img src={constructionSign} alt="construction sign" style={icon} />
			this website is still a work in progress check sometime later ...
			thanks!
		</span>
	);
}
