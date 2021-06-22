import React, { useState, useEffect } from "react";

import { getFromUrl, getSnooFromUrl } from "./api/auth.js";
import { useSnoo } from "./stores/snoo.js";

// to be used on "/auth_redirect"
const AuthHandler = () => {
	const { snoo, setSnoo } = useSnoo();
	// make snoowrap client on mount.
	useEffect(() => {
		// find sotoed in localStorage first
		const res = getSnooFromUrl();
		console.log(res);
		if (res !== "NO_LOGIN") {
			setSnoo(res);
		}
	}, []);

	return (
		<>
			<h1>Logging in !</h1>
		</>
	);
};

export default AuthHandler;
