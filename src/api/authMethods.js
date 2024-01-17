import Snoowrap from "snoowrap";

export const getAuthUrl = (scope) => {
	// https://github.com/reddit-archive/reddit/wiki/OAuth2#authorization-implicit-grant-flow
	const authenticationUrl = Snoowrap.getAuthUrl({
		clientId: "ERx7Yyvs9gIJUg",
		scope: scope,
		redirectUri: "https://zenitsu.onrender.com/auth_redirect",
		permanent: false,
		state: "fe211bebc52eb3da9bef8db6e63104d3", // a random string, this could be validated when the user is redirected back
		response_type: "token"
	});
	// --> 'https://www.reddit.com/api/v1/authorize?client_id=foobarbaz&response_type=code&state= ...'

	return authenticationUrl.replace(
		"response_type=code",
		"response_type=token"
	);
	// window.location.href = authenticationUrl; // send the user to the authentication url
};

export const getCodeFromUrl = () => {
	// ok the attributes are not stored in searchParams but in hash.
	// return new URL(window.location.href).searchParams.get("access_token");
	const hash = window.location.hash.substr(1);

	const result = hash.split("&").reduce(function (res, item) {
		const parts = item.split("=");
		res[parts[0]] = parts[1];
		return res;
	}, {});

	// ? access_denied
	if (result.error) {
		// ! user denied access.
		// error=access_denied
		return null;
	}

	return result.access_token;
};

export const getFromUrl = (attr) => {
	// ok the attributes are not stored in searchParams but in hash.
	// return new URL(window.location.href).searchParams.get(attr);
	const hash = window.location.hash.substr(1);

	const result = hash.split("&").reduce(function (res, item) {
		const parts = item.split("=");
		res[parts[0]] = parts[1];
		return res;
	}, {});

	return result[attr];
};

export const getSnooFromUrl = () => {
	const code = getCodeFromUrl();
	console.log({ code });
	if (code === null || code === undefined) return "NO_LOGIN";
	// Now we have a requester that can access reddit through the user's account

	// I am lazy... lets just write the accessToken to the localStorage
	localStorage.setItem("accessToken", code);

	// * class: https://not-an-aardvark.github.io/snoowrap/snoowrap.html#snoowrap__anchor
	// config: https://not-an-aardvark.github.io/snoowrap/snoowrap.html#config

	return new Snoowrap({
		accessToken: code,
		userAgent: "zenitsu web app" // ? lmao import from consts.
		// ! add userAgent.
	});

	/*
		*userAgent	string
		A unique description of what your app does. This argument is not necessary when snoowrap is running in a browser.

		*clientId	string	<optional>
		The client ID of your app (assigned by reddit)

		*clientSecret	string	<optional>
		The client secret of your app (assigned by reddit). If you are using a refresh token with an installed app (which does not have a client secret), pass an empty string as your clientSecret.

		*username	string	<optional>
		The username of the account to access

		*password	string	<optional>
		The password of the account to access

		*refreshToken	string	<optional>
		A refresh token for your app

		*accessToken	string	<optional>
		An access token for your app
	 */

	// return await snoowrap
	// 	.fromAuthCode({
	// 		code: code,
	// 		userAgent: "My app",
	// 		clientId: "foobarbazquuux",
	// 		redirectUri: "example.com"
	// 	})
	// 	.catch((e) => {
	// 		console.log(e);
	// 	});
};
