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

	useHotkeys("g g", () => {
		document.querySelector("#root").scrollIntoView();
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
						banner
					}}
				/>
			</div>
		</div>
	);
}

export default App;
