import React, { useState, useEffect } from "react";

// components
import LoginButton from "./Login.js";
import Preferences from "./Preferences.js";
import ProfilePic from "./ProfilePic.js";

// stores
import { useLoggedIn } from "./../stores/loggedIn.js";

// icons
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

const RightNav = ({ toggleTheme, toggleInfo, setLoggedIn }) => {
	const loggedIn = useLoggedIn((s) => s.loggedIn);
	// const loggedIn = true;

	return (
		<span className="right">
			{loggedIn ? (
				<ProfilePic userName={"HarshitJoshi9152"} />
			) : (
				<LoginButton {...{ loggedIn, setLoggedIn }} />
			)}
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
