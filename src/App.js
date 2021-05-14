import React, { useRef, useState } from "react";
import { useLocation, useRouteMatch, Route, Switch } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";

import Home from "./components/Home.js";

function App() {
	// app should show sub selection page or home page on /
	let m = useRouteMatch("/:postUrl");
	// {match:{params:{subName}}}
	console.log(m?.params?.postUrl);
	// const [subreddit, setSubreddit] = useState("showerthoughts");
	const [subCount, setSubCount] = useState();
	const [viewStyle, setViewStyle] = useState(false);
	const [shouldBlurAll, setShouldBlurAll] = useState(true);

	useHotkeys("ctrl + shift + b", (e) => {
		// prevent hiding, opening bookmarks bar.
		e.preventDefault();
		setShouldBlurAll((b) => !b);
	});

	// scroll to top
	useHotkeys("g g", () => {
		document.querySelector("#root").scrollIntoView();
	});

	// switch to vert split view style
	useHotkeys("ctrl + v", () => {
		// bad implementation and bad var names actually.
		setViewStyle((vs) => !vs);
	});

	return (
		<div className="App">
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route path="/:subreddit">
					<Header subCount={subCount} />
					<div className="container">
						{/*<Sidebar />*/}
						<Thoughts
							{...{
								setSubCount,
								viewStyle,
								shouldBlurAll
							}}
						/>
					</div>
				</Route>
			</Switch>
		</div>
	);
}

export default App;
