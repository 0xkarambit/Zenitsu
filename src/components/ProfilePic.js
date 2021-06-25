// todo: i should make a component for this user-info bar.
import { useMemo, useEffect, useState } from "react";
import { useLoggedIn } from "./../stores/loggedIn.js";
import { useSnoo } from "./../stores/snoo.js";

async function getProfilePic(userName) {
	// ? OK SO I CANT GET THE ICON_IMG (without OAuth ig)|| Error 403 also we cant load these for every comment. too much data use
	const res = await fetch(
		`https://www.reddit.com/user/${userName}/about.json`
	);
	const json = await res.json();
	console.log({ profileData: json });
	return json?.data?.icon_img;
}

const ProfilePic = ({ userName }) => {
	// const { snoo } = useSnoo();

	// wow useMemo fixed this scary bug ! OK ITS BACK AFTER RELOAD LOL.
	// const url = useMemo(async () => await getProfilePic(userName), [userName]);

	const [url, setUrl] = useState(null);

	useEffect(() => {
		(async () => {
			const u = await getProfilePic(userName);
			//! we cant get imgs from styles.redditmedia.com we get a 403 ig.
			setUrl(u);
		})();
	}, [userName]);

	// color is in data.subreddit.icon_color ?
	return <img src={url} alt={userName} className="profilepic" />;
};

export default ProfilePic;
