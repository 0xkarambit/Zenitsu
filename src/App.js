import React, { useState } from "react";

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";

function App() {
	const [subreddit, setSubreddit] = useState("showerthoughts");

	return (
		<div className="App">
			<Header subreddit={subreddit} setSubreddit={setSubreddit} />
			<div className="container">
				<Sidebar />
				<Thoughts subreddit={subreddit} />
			</div>
		</div>
	);
}

export default App;
