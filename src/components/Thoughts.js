import React from "react";
import "./thoughts.css";

export default function Thoughts(props) {
	return (
		<div>
			<Post></Post>
			{/*
				search
				top
				hot
				new
				viewstyle -> compact | detailed

			*/}
		</div>
	);
}

function Post(props) {
	return (
		<div className="post">
			<h2>Title</h2>
			<p className="postbody">body</p>
			<span className="details">Wow so empty..</span>
		</div>
	);
}
