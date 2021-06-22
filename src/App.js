import React, { useState } from "react";
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

function App() {
	const history = useHistory();
	const [shouldBlurAll, setShouldBlurAll] = useState(true);

	// #region getting shortcuts mapping
	const over18ContentBlurKeys = useKeyMappings(
		(s) => s.over18ContentBlurKeys
	);
	const goBackKeys = useKeyMappings((s) => s.goBackKeys);
	const scrollToTopKeys = useKeyMappings((s) => s.scrollToTopKeys);
	// #endregion

	// #region keyboard shortcuts
	// toggle over18ContentBlur.
	useHotkeys(over18ContentBlurKeys, (e) => {
		// prevent hiding, opening bookmarks bar.
		e.preventDefault();
		setShouldBlurAll((b) => !b);
	});
	// goBack
	useHotkeys(goBackKeys, () => history.goBack());

	// scroll to top/ scrollToTop
	useHotkeys(scrollToTopKeys, () => {
		document.querySelector("#root").scrollIntoView();
	});
	// #endregion

	return (
		<Provider>
			<div className="App">
				<Switch>
					<Route exact path="/">
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
