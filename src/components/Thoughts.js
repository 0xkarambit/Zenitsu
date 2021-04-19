import React from "react";
import "./thoughts.css";

import StackGrid from "react-stack-grid";

export default function Thoughts(props) {
	const [displayMode, setDisplayMode] = React.useState("stack");
	const [postsData, setPostsData] = React.useState([...Array(1)]);

	// fetching the data on mount;
	React.useEffect(() => {
		// const url = "https://www.reddit.com/r/Showerthoughts/top/?t=month";
		// by default .json at the end pulls the hot listings
		const url = "https://www.reddit.com/r/Showerthoughts.json";
		fetch(url)
			.then((res) => (res.status !== 200 ? 1 : res.json()))
			.then((json) => {
				console.log(json.data.children);
				setPostsData(json.data.children);
			});
		return () => {};
	}, []);

	// generating POSTS
	let posts = [];
	for (let i in postsData) {
		// let metaData = postsData[i]
		posts.push(<Post key={i} {...postsData[i].data}></Post>);
	}

	return (
		<div className="viewarea">
			{displayMode === "stack" && (
				<StackGrid columnWidth={300}>{posts}</StackGrid>
			)}
		</div>
	);
}

function Post({
	title,
	selftext,
	score,
	author,
	total_awards_received,
	num_comments,
	created_utc
}) {
	return (
		<div className="post">
			<h2>{title || "title"}</h2>
			{selftext && <p className="postbody">{selftext.slice(0, 200)}</p>}
			<span className="details">
				{author} score: {score} {total_awards_received} {num_comments}{" "}
				{created_utc}
			</span>
		</div>
	);
	// score, total_awards_received
}

// return (
// 	<div>
// 		<Post></Post>
// 		{/*
// 			search
// 			top
// 			hot
// 			new
// 			viewstyle -> compact | detailed

// 		*/}
// 	</div>
// );
