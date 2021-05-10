import { useMemo } from "react";

async function getProfilePic(id) {
	// ? OK SO I CANT GET THE ICON_IMG (without OAuth ig)|| Error 403 also we cant load these for every comment. too much data use
	const res = await fetch(`https://www.reddit.com/user/${id}/about.json`);
	const json = await res.json();
	console.log(json);
	return json?.data?.icon_img;
}

const ProfilePic = ({ id }) => {
	// wow useMemo fixed this scary bug ! OK ITS BACK AFTER RELOAD LOL.
	// todo: i should make a component for this user-info bar.
	const url = useMemo(async () => await getProfilePic(id), [id]);
	// color is in data.subreddit.icon_color
	return <img src={url} alt={id} className="profilepic" />;
};

export default ProfilePic;
