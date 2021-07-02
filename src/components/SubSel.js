import React, { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouteMatch } from "react-router-dom";
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
					// ok i wrote all this new code to support a supposedly simple component that i could have used a lib for fml
					if (
						e.key === "ArrowUp" ||
						e.key === "ArrowDown" ||
						e.key === " "
					) {
						e.preventDefault();
					} else {
						// this is imp because on pressing `j`,`k` scroll handlers might get triggered.
						e.stopPropagation();
					}
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
	// stores suggested sub names, should i store results in session storage to avoid fetching again & again ?
	const {
		params: { sub }
	} = useRouteMatch("/r/:sub");
	const [suggestions, setSuggestions] = useState([]);
	const [focusedSuggIndex, setFocusedSuggIndex] = useState(null);

	const time = 230;
	// ok so this has to be a debounce thing
	useEffect(() => {
		if (query === "r/") return null;
		const timer = setTimeout(() => {
			snoo.searchSubredditNames({ query })
				.then(setSuggestions)
				.catch(console.log);
		}, time);
		return () => {
			clearTimeout(timer);
			setSuggestions([]);
		};
	}, [query]);

	// #region keyboardShortcuts
	useHotkeys(
		"down",
		() => {
			if (focusedSuggIndex === null) {
				setFocusedSuggIndex(0);
			} else {
				setFocusedSuggIndex((f) =>
					f + 1 >= suggestions.length ? 0 : f + 1
				);
			}
		},
		// important !
		{ enableOnTags: ["INPUT"] },
		[focusedSuggIndex]
	);
	useHotkeys(
		"up",
		() => {
			if (focusedSuggIndex === null) {
				setFocusedSuggIndex(suggestions.length - 1);
			} else {
				setFocusedSuggIndex((f) =>
					f - 1 < 0 ? suggestions.length - 1 : f - 1
				);
			}
		},
		{ enableOnTags: ["INPUT"] },
		[focusedSuggIndex]
	);

	useHotkeys(
		"space",
		() => {
			sel_subreddit("r/" + suggestions[focusedSuggIndex]);
		},
		{ enableOnTags: ["INPUT"] },
		[focusedSuggIndex]
	);
	// #endregion keyboardShortcuts

	return (
		<ul>
			{suggestions.map((i) => (
				<li
					onClick={() => sel_subreddit("r/" + i)}
					data-focused={i === suggestions[focusedSuggIndex]}
					data-selected={i === sub}
				>
					{i}
				</li>
			))}
		</ul>
	);
};
