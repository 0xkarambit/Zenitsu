export default function Post({
	title,
	selftext,
	score,
	author,
	total_awards_received,
	num_comments,
	created_utc,
	permalink,
	thumbnail,
	preview,
	url,
	post_hint,
	url_overridden_by_dest,
	displayMode = "stack",
	expandView = () => {},
	index,
	loadMorePosts = false,
	postsLoader = false
}) {
	if (postsLoader) {
		console.log("endsad");
		return (
			<div className="post">
				<button onClick={loadMorePosts}>loadMorePosts</button>
			</div>
		);
	}
	const link = `https://www.reddit.com${permalink}`;
	const badThumbnails = ["", "self"];
	// const imageUrl = preview.images[0].resolutions[] // these urls dont work restricted BUT url will work here
	// todo: oh there can be multiple photos
	const dateCreated = new Date(+`${created_utc}000`).toLocaleString();
	// const relativeTime = new Intl.relativeTimeFormat("en", {style: "long", numeric: "auto"})
	// console.log(post_hint);
	return (
		<div
			className="post"
			onClick={() => {
				expandView(index);
			}}
		>
			<p className="author">{`u/${author}`}</p>
			<h2 className="title">{title || "title"}</h2>
			<p className="postbody">
				{(() => {
					if (selftext) {
						return displayMode === "stack"
							? selftext.slice(0, 200)
							: selftext;
					}
				})()}
			</p>
			{/* IMAGE imlementaion region */}
			{displayMode === "stack" && !badThumbnails.includes(thumbnail) && (
				<img src={thumbnail} alt="thumbnail"></img>
			)}
			{(() => {
				if (displayMode === "focus") {
					if (post_hint === "image") {
						return (
							<img
								height="400px"
								width="400px"
								src={url}
								alt="thumbnail"
								style={{ objectFit: "contain" }}
							></img>
						);
					} else if (post_hint === "hosted:video") {
						return (
							<video
								src={url_overridden_by_dest}
								type="video/mp4"
								controls="true"
								loop="true"
								preload="metadata"
								poster={thumbnail}
								height="400px"
								width="400px"
							></video>
						);
					}
				}
			})()}
			{/* IMAGE implementation regionEnd */}
			{/* score: {score} {total_awards_received} {num_comments}
				{created_utc} */}
			<span className="details">
				score: {score} awards: {total_awards_received} created:{" "}
				{dateCreated}
			</span>
			{/* <div className="speech">
				<Speech stop={true} pause={true} resume={true} text={title} />
			</div> */}
			{/*todo: OK so the url here that we consider the link to comments is the image link ends in png
			 in r/mechanicalkeyboards but in r/showerthoughts $url is a link to the post comments
			 FIX: instead use permalink [nope didnt work] sometimes it does lol
			 		--oh ya it did work i had a syntax error url : permalink
			 idea: hmm check for png / jpg / gif / mp4 etc at end (for video its v.reddit.... no mp4)
			 idea: can we get image with "thumbnail" ?*/}
			<a href={link}>{link}</a>
		</div>
	);
	// score, total_awards_received
}
