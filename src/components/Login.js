import React, { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { VscAccount } from "react-icons/vsc";

import "./login.css";

// move style def to specialised file
const iconStyle = {
	width: "32px",
	height: "32px",
	margin: "0px 8px 0px 8px",
	cursor: "pointer"
};

const LoginButton = ({ loggedIn, setLoggedIn }) => {
	// if logged in show user profile pic instead.
	const [hide, setHide] = useState(true);

	useHotkeys("l", (e) => setHide(false));

	const clicked = () => {
		setHide((show) => !show);
	};

	return (
		<span>
			{!loggedIn && (
				<VscAccount
					onClick={clicked}
					style={iconStyle}
					title="Sign In"
				/>
			)}
			{!hide && <LoginPopup setHide={setHide}></LoginPopup>}
			{/*!hide && <LoginPopup setHide={setHide} />*/}
		</span>
	);
};

export default LoginButton;

/* I JUST REMEMBERED WE DONT NEED THIS POPUP LOL I SPENT THE ENTIRE DAY ON THIS LOL*/
/* FINALLY I FIXED ALL THE CSS PROBLEMS I FEEL REALLY GOOD HAVING DONE THIS BUT 
	 I DONT THINK WE WILL NEED THIS AT ALL*/
const useForm = (initialState) => {
	const [data, setData] = useState(initialState);

	const change = (e) => {
		const value =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;
		setData((data) => ({
			...data,
			[e.target.name]: value
		}));
	};

	return [data, setData, change];
};

const forgotPassLink = "https://www.reddit.com/password";

const LoginPopup = ({ setHide }) => {
	// used to focus on username input field and to close popup on outside click.
	const [popup, userInput] = [useRef(), useRef()];

	useHotkeys("Escape", () => {
		userInput.current.blur();
		setHide(true);
	});

	const watchEsc = (e) => (e.key === "Escape" ? setHide(true) : null);

	useEffect(() => {
		userInput.current.focus(); // focusing on the form
		const watch = (e) => {
			// we need to check path otherwise clickin a child also hides the popup.
			!e.path.includes(popup.current) && setHide(true);
		};
		document.addEventListener("click", watch);

		return () => {
			document.removeEventListener("click", watch);
		};
	}, []);

	const [formData, setFormData, onChange] = useForm({
		username: "",
		password: "",
		remember_me: false
	});

	const { username, password, remember_me } = formData;

	const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&
	state=RANDOM_STRING&redirect_uri=URI&scope=SCOPE_STRING`;

	const submit = () => {
		// save state ????
		// should i hide it ?
		setHide(true);
	};

	const toggleChecked = () => {
		setFormData((d) => ({
			...d,
			remember_me: !d.remember_me
		}));
	};

	return (
		<div className="login-popup" ref={popup}>
			<div className="contain">
				<h2>Sign In</h2>
				<input
					// what are autoCorrect, autoComplete, autoSave
					autoFocus
					type="text"
					className="username"
					name="username"
					placeholder="username"
					onKeyDown={watchEsc}
					ref={userInput}
					onChange={onChange}
					value={username}
				/>{" "}
				<input
					type="password"
					className="password"
					name="password"
					placeholder="password"
					onKeyDown={(e) => {
						e.key === "Enter" && submit();
						watchEsc(e);
					}}
					onChange={onChange}
					value={password}
				/>{" "}
				<span>
					<span
						className="remember_me"
						// to check the input box on click over entire span
						onClick={toggleChecked}
					>
						<input
							type="checkbox"
							name="remember_me"
							checked={remember_me}
							onKeyDown={(e) =>
								e.key === "Enter" && toggleChecked()
							}
						/>
						<label htmlFor="remmember_me">Remember me</label>
					</span>
					<span className="login-popup-right">
						<a
							href={forgotPassLink}
							target="_blank"
							rel="noreferrer"
						>
							Forgot password ?
						</a>
					</span>
				</span>
				<button onClick={submit} type="submit">
					Submit
				</button>
			</div>
		</div>
	);
};
