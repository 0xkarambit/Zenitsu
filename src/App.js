import React, { useRef, useState } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";

function App() {
	// app should show sub selection page or home page on /
	let m = useRouteMatch("/:postUrl");
	// {match:{params:{subName}}}
	console.log(m?.params?.postUrl);
	const [subreddit, setSubreddit] = useState("showerthoughts");
	const previousSubreddit = useRef();
	const [subCount, setSubCount] = useState();
	const banner = useRef();
	const [viewStyle, setViewStyle] = useState(false);

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
			<Header
				subreddit={subreddit}
				setSubreddit={setSubreddit}
				previousSubreddit={previousSubreddit}
				subCount={subCount}
				ref={banner}
			/>
			<div className="container">
				<Sidebar />
				<Thoughts
					{...{
						subreddit,
						setSubreddit,
						previousSubreddit,
						setSubCount,
						banner,
						viewStyle
					}}
				/>
			</div>
		</div>
	);
}

export default App;
