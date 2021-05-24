import React, { useState, useEffect, useRef } from "react";

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

	const clicked = () => {
		setHide((show) => !show);
	};

	const submit = () => {
		alert("LOGGGIN IN !");
	};

	return (
		<span className="login-button">
			{!loggedIn && (
				<VscAccount
					onClick={clicked}
					style={iconStyle}
					title="Sign In"
				/>
			)}
			{!hide && <LoginPopup {...{ setHide, submit }} />}
		</span>
	);
};

export default LoginButton;

const LoginPopup = ({ setHide, submit }) => {
	const [popup, user] = [useRef(), useRef()];

	useEffect(() => {
		user.current.focus(); // focusing on the form
		const watch = (e) => e.target !== popup.current && setHide(true);
		document.addEventListener("click", watch);

		return () => {
			document.removeEventListener("click", watch);
		};
	}, []);

	return (
		<div class="login-popup" ref={popup}>
			<h2>Sign In</h2>
			<input
				type="text"
				className="user"
				placeholder="username"
				ref={user}
			/>{" "}
			<br />
			<input
				type="password"
				className="pass"
				placeholder="password"
			/>{" "}
			<br />
			<button onClick={submit} type="submit">
				Submit
			</button>
		</div>
	);
};
