import React, { useState, useEffect } from "react";

import LoginButton from "./Login.js";

import {
	VscColorMode,
	VscInfo,
	VscGithubInverted,
	// VscAccount,
	VscSettingsGear
} from "react-icons/vsc";

const iconStyle = {
	width: "32px",
	height: "32px",
	margin: "0px 8px 0px 8px"
};

const repoLink = "https://github.com/HarshitJoshi9152/showerthoughts";

const RightNav = ({ toggleTheme, toggleInfo, loggedIn, setLoggedIn }) => {
	return (
		<span className="right">
			<LoginButton {...{ loggedIn, setLoggedIn }} />
			<VscSettingsGear style={iconStyle} title="settings" />
			<span className="theme-switch">
				<VscColorMode style={iconStyle} onClick={toggleTheme} />
			</span>
			<span className="info">
				<VscInfo style={iconStyle} onClick={toggleInfo} />
			</span>
			<a
				href={repoLink}
				target="_blank"
				rel="noreferrer"
				className="repo-link"
				tabIndex="-1"
			>
				<VscGithubInverted style={iconStyle} title={repoLink} />
			</a>
		</span>
	);
};

export default RightNav;
