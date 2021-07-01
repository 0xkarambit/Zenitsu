import React, { useEffect, useRef, useState } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Provider } from "jotai";

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";
import NotFound from "./NotFound.js";
import AuthHandler from "./AuthHandler.js";

import Home from "./components/Home.js";

// stores
import { useKeyMappings } from "./stores/keymappings.js";
import { useLoggedIn } from "./stores/loggedIn.js";

// consts

import { scrollHeight } from "./utils/consts.js";

function App() {
	const history = useHistory();
	const [shouldBlurAll, setShouldBlurAll] = useState(true);
	const { loggedIn } = useLoggedIn();
	// #region getting shortcuts mapping
	const over18ContentBlurKeys = useKeyMappings(
		(s) => s.over18ContentBlurKeys
	);
	const goBackKeys = useKeyMappings((s) => s.goBackKeys);
	const scrollToTopKeys = useKeyMappings((s) => s.scrollToTopKeys);
	// #endregion

	// #region keyboard shortcuts

	// ? toggle over18ContentBlur.
	useHotkeys(over18ContentBlurKeys, (e) => {
		// prevent hiding, opening bookmarks bar.
		e.preventDefault();
		setShouldBlurAll((b) => !b);
	});
	// ? goBack
	useHotkeys(goBackKeys, () => history.goBack());

	// ? scroll to top/ scrollToTop
	useHotkeys(scrollToTopKeys, () => {
		document.querySelector("#root").scrollIntoView();
	});

	// ? JK to scroll
	/* ? ok so smooth-scrolling here causes problems !
		 the page doesnt get scrolled immediately so when the user keeps on pressing the j,k buttons the
		 window.scrollBy keeps getting called and coz window.scrollBy takes in a relative height, the scroll
		 gets kinda reset
		 and i see no way to set scroll-behavior to `not smooth` only {"auto", "smooth"} allowed,
		 so i will have to remove scroll-behavior: smooth
		 and use $node.scrollIntoView({behavior:"smooth"}) everywhere !
		 ? wait lets try to time the scroll ! :better but not good enough!
		 use time: 500ms, 800ms
	*/
	useHotkeys("j", () => {
		window.scrollBy({
			left: 0,
			top: scrollHeight
		});
	});

	useHotkeys("k", () => {
		window.scrollBy({
			left: 0,
			top: -1 * scrollHeight
		});
	});
	// #endregion

	return (
		<Provider>
			<div className="App">
				<Switch>
					<Route exact path="/">
						{/*if logged in show feed ! */}
						<Home />
					</Route>
					<Route path="/r/:subreddit">
						<Header />
						<div className="container">
							{/*<Sidebar />*/}
							<Thoughts
								{...{
									shouldBlurAll
								}}
							/>
						</div>
					</Route>

					<Route path="/auth_redirect">
						<AuthHandler></AuthHandler>
					</Route>
					<Route>
						<NotFound />
					</Route>
				</Switch>
			</div>
		</Provider>
	);
}

export default App;
