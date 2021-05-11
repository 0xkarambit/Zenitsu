import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import "./Home.css";

const Home = (props) => {
	const [sub, setSub] = useState("showerthoughts");
	const history = useHistory();

	const changed = (e) => {
		console.log(e);
		setSub(e.target.value);
	};

	return (
		// might wanna make a vert split twitter like home page.
		<div className="home">
			<div className="box">
				<h1>Select a subreddit to browse</h1>
				<input
					type="text"
					className="selector"
					placeholder="Subreddit"
					value={sub}
					onKeyDown={(e) => e.key === "Enter" && history.push(sub)}
					onChange={changed}
				/>
			</div>
		</div>
	);
};

export default Home;
