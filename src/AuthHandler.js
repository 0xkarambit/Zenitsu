import React, { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
	getFromUrl,
	getSnooFromUrl,
	getCodeFromUrl
} from "./api/authMethods.js";
import { useSnoo } from "./stores/snoo.js";

// to be used on "/auth_redirect"
const AuthHandler = () => {
	const { snoo, setSnoo } = useSnoo();
	const [authorised, setAuthorised] = useState(false);
	const [code, setCode] = useState(null);
	// make snoowrap client on mount.
	useEffect(() => {
		// find sotoed in localStorage first
		const res = getSnooFromUrl();
		console.log({ res });
		if (res === "NO_LOGIN") {
			// the user didnt allow auth.
		}
		setSnoo(res);
		setAuthorised(true);
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

	useHotkeys("shift + l", () => (authorised && !loaded ? load() : null));

	return (
		<>
			<h1>Logging in !</h1>
			<h1>{code}</h1>
			{loaded && data.map((title) => <p>{title}</p>)}
		</>
	);
};

export default AuthHandler;
