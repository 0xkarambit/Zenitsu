import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import {
	getFromUrl,
	getSnooFromUrl,
	getCodeFromUrl
} from "./api/authMethods.js";

// stores
import { useSnoo } from "./stores/snoo.js";
import { useLoggedIn } from "./stores/loggedIn.js";

// to be used on "/auth_redirect"
const AuthHandler = () => {
	const { snoo, setSnoo } = useSnoo();
	const { loggedIn, setLoggedIn } = useLoggedIn();
	const [code, setCode] = useState(null);
	const [timeleft, setTimeleft] = useState();

	// ? make snoowrap client on mount.
	useEffect(() => {
		setInterval(() => {
			console.log("called");
			if (timeleft && timeleft > 0 && timeleft !== "stop")
				setTimeleft((t) => t - 1);
		}, 1000);
		// find sotoed in localStorage first
		const res = getSnooFromUrl();
		console.log({ res });
		if (res === "NO_LOGIN") {
			// the user didnt allow auth.
			return null;
		}
		setSnoo(res);
		setLoggedIn(true);

		const c = getCodeFromUrl();
		setCode(c);
	}, []);

	const [loaded, setLoaded] = useState(false);
	const [data, setData] = useState(false);

	const load = () => {
		const data = snoo.getHot().map((post) => post.title);
		data.then((titles) => setData(titles)); // on success.
		setLoaded(true); // on success.
		console.log("DONE!");
		console.log(snoo);
	};

	// ! add read scope
	// ! find a way to find required scopes for the methods
	// ! test this <SHORTCUT>function in dev server.

	// !ok shift + l doesnt work i guess but the $snoo does.

	useHotkeys("x", (e) => {
		console.log("called");
		console.log(e);
		if (loggedIn && !loaded) {
			load();
		}
	});

	return (
		<>
			<h1>Logging in !</h1>
			<h1>{code}</h1>
			{loaded && data.map((title) => <p>{title}</p>)}
			<h2>
				{loggedIn
					? "Authorised !" //+ user name
					: "Authentication Request Rejected."}
			</h2>
			redirecting to /. in {timeleft}
			<button onClick={() => setTimeleft("stop")}>stop count</button>
			{/*HOME FEED ? idk maybe "/feed" or if not authorised to "/"*/}
			{timeleft === 0 && <Redirect to="/"></Redirect>}
		</>
	);
};

export default AuthHandler;
// <Redirect
// to={{
// 	pathname: "/login",
// 	search: "?utm=your+face",
// 	state: { referrer: currentLocation }
// }}
// />
