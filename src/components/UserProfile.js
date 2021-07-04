// GetBest works to get home screen !!!!
// snoo.getMe returns your own RedditUser Object !
import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useLoggedIn } from "../stores/loggedIn.js";

// components
import { Img } from "react-image";
import RightNav from "./rightNav.js";

// util functions.
import { makeFriendly } from "./../utils/num.js";

// stores
import { useSnoo } from "./../stores/snoo.js";

// css
import "./userProfile.css";

// icons
import { BiCake } from "react-icons/bi";
import { RiCake2Line } from "react-icons/ri";

// ! need history scope
const UserProfile = () => {
	const {
		params: { user }
	} = useRouteMatch("/u/:user");

	const snoo = useSnoo((s) => s.snoo);
	const loggedIn = useLoggedIn((s) => s.loggedIn);
	const [overview, setOverview] = useState([]);
	const [info, setInfo] = useState({});
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		if (!loggedIn) return null;
		// ! ok so we will have to check link_id for checking if its a comment or a post !
		snoo.getUser(user).getOverview().then(setOverview);
		snoo.getUser(user)
			.fetch()
			.then((i) => {
				setInfo(i);
				setLoaded(true);
			});
		return () => {
			// setInfo(null);
			// setOverview(null);
			// setLoaded(false);
		};
	}, [loggedIn, user]);

	if (!loggedIn) return <h1>YOU MUST BE LOGGED IN TO VIEW USER INFO !</h1>;
	// <INFO info={info}></INFO>
	return (
		<>
			{loaded ? (
				<>
					<UserHeader user={user} info={info}></UserHeader>
					<div className="container"></div>
				</>
			) : (
				<h1>Loading </h1>
			)}
		</>
	);
};

export default UserProfile;

const UserHeader = ({ user, info }) => {
	// nanda snoovtar ?
	const { total_karma, created, icon_img, subreddit } = info;

	console.log({ info });

	const cake_day = new Intl.DateTimeFormat("en-us", {
		dateStyle: "medium"
	}).format(new Date(+`${created}000`));

	useEffect(() => {
		// subreddit.fetch();
		// subreddit.display_name.public_desciption
	}, []);

	const style = { width: "56px", height: "56px" };

	const toggleTheme = () => {};
	const toggleInfo = () => {};
	return (
		<header className="userHeader">
			<span>
				<span>
					<Img
						src={icon_img}
						style={style}
						className="sub-icon"
					></Img>
					<p className="banner">u/{user}</p>
				</span>
				<span className="karma">{makeFriendly(total_karma)} karma</span>
				<span className="cakeday">
					<RiCake2Line className="cake-icon"></RiCake2Line>
					<p>{cake_day}</p>
					{/*OR CREATED_UTC ?*/}
				</span>
			</span>
			<RightNav {...{ toggleTheme, toggleInfo }}></RightNav>
		</header>
	);
};

// export default UserHeader;
