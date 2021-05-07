import React, { useState } from "react";
import "./sidebar.css";
import SearchLogo from "./../assets/icons/search.svg";

export default function Sidebar(props) {
	// const [displayStyle, setDisplayStyle] = useState();

	return (
		<div className="sidebar">
			<SearchBar></SearchBar>
			<span>
				<button>Top</button>
				<button>hot</button>
				<button>New</button>
			</span>
		</div>
	);
}

function SearchBar(props) {
	const icon = {
		width: "20px",
		height: "20px"
	};
	const level = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	};
	return (
		<span style={level}>
			<input type="text" placeholder="Search"></input>
			<img src={SearchLogo} style={icon} alt="search icon"></img>
		</span>
	);
}
