import React, { useState } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Provider } from "jotai";

import Header from "./components/Header.js";
// import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";
import NotFound from "./NotFound.js";

import Home from "./components/Home.js";

// const renderAtom = atom(false);

function App() {
	const history = useHistory();
	const [shouldBlurAll, setShouldBlurAll] = useState(true);

	useHotkeys("ctrl + shift + b", (e) => {
		// prevent hiding, opening bookmarks bar.
		e.preventDefault();
		setShouldBlurAll((b) => !b);
	});

	useHotkeys("backspace", () => history.goBack());

	// scroll to top
	useHotkeys("g", () => {
		document.querySelector("#root").scrollIntoView();
	});

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
					<Route>
						<NotFound />
					</Route>
				</Switch>
			</div>
		</Provider>
	);
}

export default App;
