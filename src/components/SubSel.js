import React, { useState, useEffect, useRef } from "react";

// css
import "./SubSel.css";

export const SubredditSelect = ({
	sel_subreddit,
	subreddit,
	closeSelectMenu
}) => {
	// todo: add auto complete and make it a full power menu.
	const subSel = useRef();
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
