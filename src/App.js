import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";

function App() {
	const [subreddit, setSubreddit] = useState("showerthoughts");
	const previousSubreddit = useRef();

	return (
		<div className="App">
			<Header
				subreddit={subreddit}
				setSubreddit={setSubreddit}
				previousSubreddit={previousSubreddit}
			/>
			<div className="container">
				<Sidebar />
				<Thoughts {...{ subreddit, setSubreddit, previousSubreddit }} />
			</div>
		</div>
	);
}

export default App;
