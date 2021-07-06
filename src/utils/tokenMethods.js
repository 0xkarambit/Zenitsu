export const storeToken = (token) => {
	// store token in session storage !
	const o = {
		token,
		time: Date.now()
	};
	sessionStorage.setItem("access_token", JSON.stringify(o));
};

export const getStoredToken = () => {
	const codeObj = JSON.parse(sessionStorage.getItem("access_token"));
	if (codeObj === null) return "NOT_STORED";
	const passed_ms = Date.now() - codeObj.time;
	// ms -> sec -> min -> hr
	if (passed_ms / 1000 / 60 / 60 > 1) {
		return "EXPIRED";
	}
	return codeObj.token;
};
