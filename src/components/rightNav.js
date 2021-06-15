import React, { useState, useEffect } from "react";

import LoginButton from "./Login.js";
import Preferences from "./Preferences.js";

import {
	VscColorMode,
	VscInfo,
	VscGithubInverted,
	// VscAccount,
	VscSettingsGear
} from "react-icons/vsc";
import { useHotkeys } from "react-hotkeys-hook";

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
			<Settings></Settings>
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

const Settings = () => {
	const [show, setShow] = useState(false);

	useHotkeys("f", () => setShow((s) => !s));

	return (
		<>
			<VscSettingsGear
				style={iconStyle}
				title="settings"
				onClick={() => setShow((s) => !s)}
			/>
			{show && <Preferences />}
		</>
	);
};

// export default Settings;
