import React, { useState, useEffect, useRef } from "react";

import { useHistory, Link } from "react-router-dom";

import "./Home.css";

const Home = (props) => {
	const [sub, setSub] = useState("showerthoughts");
	const history = useHistory();
	const input = useRef();

	useEffect(() => {
		input.current.focus();
	}, []);

	const changed = (e) => {
		console.log(e);
		setSub(e.target.value);
	};

	if (true) {
		return (
			<div className="home">
				<div className="box">
					<div className="banner">
						<h1>Kanji</h1>
						<p>faster, cleaner, better!</p>
						<p>Select a subreddit to browse</p>
						<input
							type="text"
							className="selector"
							placeholder="Subreddit"
							value={sub}
							onKeyDown={(e) =>
								e.key === "Enter" && history.push(sub)
							}
							onChange={changed}
							ref={input}
						/>
					</div>
					<div className="selection-box"></div>
				</div>
			</div>
		);
	}

	return (
		// might wanna make a vert split twitter like home page.
		<div className="home">
			<div className="right">
				<div className="content">
					<div className="desc">
						<h2>what is Kanji ?</h2>
						Kanji is a reddit client built by{" "}
						<Link>@HarshitJoshi9152</Link> for a better and faster
						browsing experience, one which is more assisted by your
						keyboard.
					</div>
					<div className="features">
						<h2>Features</h2>
						<ul style={{ listStyle: "none" }}>
							<li href="">awesome design</li>
							<li>full keyboard accessibility</li>
							<li>lightning speed</li>
							<li>truely customisable experience</li>
							<li>Extensibility</li>{" "}
							{/*Plugins support for subreddit etc */}
							<li>open source</li>
						</ul>
					</div>
					<div className="feedback">
						<h2>see what others have to say about it</h2>
					</div>
				</div>
			</div>
			<div className="left">
				<div className="box">
					<div className="banner">
						<h1>Kanji</h1>
						<p>faster, cleaner, better!</p>
					</div>
					<div className="selection-box">
						<p>Select a subreddit to browse</p>
						<input
							type="text"
							className="selector"
							placeholder="Subreddit"
							value={sub}
							onKeyDown={(e) =>
								e.key === "Enter" && history.push(sub)
							}
							onChange={changed}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
