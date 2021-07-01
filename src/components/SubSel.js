import React, { useState, useEffect, useRef } from "react";
import { useLoggedIn } from "../stores/loggedIn.js";

// stores
import { useSnoo } from "./../stores/snoo.js";

// css
import "./SubSel.css";

export const SubredditSelect = ({
	sel_subreddit,
	subreddit,
	closeSelectMenu
}) => {
	// todo: add react-hook-forms !
	// todo: add auto complete and make it a full power menu.
	const subSel = useRef();
	const [inputSub, setInputSub] = useState(`r/${subreddit}`);

	const loggedIn = useLoggedIn((s) => s.loggedIn);

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
					// this is imp because on pressing `j`,`k` scroll handlers might get triggered.
					e.stopPropagation();
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
			{loggedIn && (
				<SuggestionsList
					query={inputSub}
					sel_subreddit={sel_subreddit}
				/>
			)}
		</div>
	);
};

const SuggestionsList = ({ query, sel_subreddit }) => {
	const snoo = useSnoo((s) => s.snoo);
	// stores suggested sub names, should i store results to avoid fetching again & again ?
	const [suggestions, setSuggestions] = useState([]);
	const time = 500;
	// ok so this has to be a debounce thing
	useEffect(() => {
		if (query === "r/") return null;
		const timer = setTimeout(() => {
			snoo.searchSubredditNames({ query }).then(setSuggestions);
		}, time);
		return () => {
			clearTimeout(timer);
		};
		//http://localhost:3000/auth_redirect#access_token=-iAbSbIsOBvoTE5llVYXnx09Khv5XZg
	}, [query]);

	return (
		<ul>
			{suggestions.map((i) => (
				<li onClick={() => sel_subreddit("r/" + i)}>{i}</li>
			))}
		</ul>
	);
};
