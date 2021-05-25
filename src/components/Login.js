import React, { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { VscAccount } from "react-icons/vsc";

import "./login.css";

// move style def to specialised file
const iconStyle = {
	width: "32px",
	height: "32px",
	margin: "0px 8px 0px 8px"
};

const LoginButton = ({ loggedIn, setLoggedIn }) => {
	// if logged in show user profile pic instead.
	const [hide, setHide] = useState(true);

	useHotkeys("l", (e) => setHide(false));

	const clicked = () => {
		setHide((show) => !show);
	};

	return (
		<span>
			{!loggedIn && (
				<VscAccount
					onClick={clicked}
					style={iconStyle}
					title="Sign In"
				/>
			)}
			{!hide && <LoginPopup setHide={setHide} />}
		</span>
	);
};

export default LoginButton;

const LoginPopup = ({ setHide }) => {
	// used to focus on username input field and to close popup on outside click.
	const [popup, userInput] = [useRef(), useRef()];

	const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&
	state=RANDOM_STRING&redirect_uri=URI&scope=SCOPE_STRING`;

	useHotkeys("Escape", () => {
		userInput.current.blur();
		setHide(true);
	});

	useEffect(() => {
		userInput.current.focus(); // focusing on the form
		const watch = (e) => {
			// we need to check path otherwise clickin a child also hides the popup.
			!e.path.includes(popup.current) && setHide(true);
		};
		document.addEventListener("click", watch);

		return () => {
			document.removeEventListener("click", watch);
		};
	}, []);

	const submit = () => {
		// should i hide it ?
		setHide(true);
	};

	const watchEsc = (e) => (e.key === "Escape" ? setHide(true) : null);

	return (
		<div class="login-popup" ref={popup}>
			<h2>Sign In</h2>
			<input
				type="text"
				className="user"
				placeholder="username"
				onKeyDown={watchEsc}
				ref={userInput}
			/>{" "}
			<br />
			<input
				type="password"
				className="pass"
				placeholder="password"
				onKeyDown={(e) => {
					e.key === "Enter" && submit();
					watchEsc(e);
				}}
			/>{" "}
			<br />
			<button onClick={submit} type="submit">
				Submit
			</button>
		</div>
	);
};
