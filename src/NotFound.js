import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
	const { pathname } = useLocation();
	return (
		<div className="page">
			<h1>404 Not Found</h1>
			<p>
				The requested resource {pathname} was not found on this website
			</p>
			<p>
				<Link to="/">Go Home</Link>
			</p>
		</div>
	);
};

export default NotFound;
