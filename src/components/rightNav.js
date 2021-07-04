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

const RightNav = ({ toggleTheme, toggleInfo }) => {
	const loggedIn = useLoggedIn((s) => s.loggedIn);

	return (
		<span>
			{/*ProfilePic is just a bit more 1111 left */}
			{loggedIn ? (
				<div
					// we have to do this to maintain symmetry because all other icons have such dimensions.
					style={{
						margin: "0px 8px",
						textAlign: "center",
						display: "grid",
						placeItems: "center"
					}}
				>
					<ProfilePic userName={"HarshitJoshi9152"} />
				</div>
			) : (
				<LoginButton />
			)}
			<span>
				<Settings></Settings>
			</span>
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
				// display: flex fixed the slightly up issue.
				style={{ display: "inherit" }}
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
