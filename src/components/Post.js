import { useState } from "react";
import Award from "./Award.js";

import VideoPlayer from "./VideoPlayer.js";
import ReactPlayer from "react-player";

import { makeFriendly } from "./../utils/num.js";
import { convertHTMLEntity } from "./../utils/htmlparsing.js";

export default function Post({
	title,
	selftext_html, // todo: post desc needs markdown too...
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
	all_awardings,
	over_18,
	domain,
	displayMode = "stack",
	shouldBlur,
	setBlur,
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
	// const relativeTime = new Intl.relativeTimeFormat("en", {style: "long", numeric: "auto"});
	return (
		<div
			className="post"
			onClick={() => {
				expandView(index);
			}}
		>
			<p className="author">{`u/${author}`}</p>
			<h2 className="title">{title || "title"}</h2>
			<p
				className="postbody"
				dangerouslySetInnerHTML={
					displayMode === "stack"
						? { __html: selftext.slice(0, 200) }
						: convertHTMLEntity(selftext)
				}
			></p>
			{/* IMAGE imlementaion region */}
			{displayMode === "stack" && !badThumbnails.includes(thumbnail) && (
				<img
					src={thumbnail}
					alt="thumbnail"
					className={
						over_18 ? "blur" : ""
					} /* bad solution well its not like
					we could unblur the thumbnails before but we need a state management 
					sys to take care of this*/
				></img>
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
								className={shouldBlur ? "blur" : ""}
								onClick={() => {
									setBlur(false); // we have to reset it on change, ok keep an array of this.
								}}
								// wait do i need to blur text too ? yes
								// todo: better yet https://stackoverflow.com/questions/11977103/blur-effect-on-a-div-element
							></img>
						);
					} else if (post_hint === "hosted:video") {
						// else is_video?
						return (
							<VideoPlayer
								videoUrl={
									url + "/DASH_1080.mp4?source=fallback"
								}
								audioUrl={
									url + "/DASH_audio.mp4?source=fallback"
								}
								poster={thumbnail}
								blur={false}
							/>
						);
					} else if (post_hint === "rich:video") {
						return <ReactPlayer url={url} loop controls pip />;
					} else {
						if (post_hint === "link") {
							return (
								<div className="incomprehensible_post_hint">
									{/*<span className="domain">{domain}</span> DOESNT LOOK GOOD RIGHT NOW SHOW AFTER REDESIGN*/}
									<span className="url">
										<a
											href={url}
											target="_blank"
											rel="noreferrer"
										>
											{url}
										</a>
									</span>
								</div>
							);
						}
						if (![undefined, "url", "link"].includes(post_hint)) {
							alert(post_hint); // wtf is a link lol check rerendering problem
							alert(url); // wtf is a link lol check rerendering problem
							// so now i gotta find the file type from the extension ?
						}
					}
				}
			})()}
			{/* IMAGE implementation regionEnd */}
			{/* score: {score} {total_awards_received} {num_comments}
				{created_utc} */}
			<span className="details">
				score: {/*todo: add icon here */}
				<span title={score} style={{ margin: "0px 5px 0px 5px" }}>
					{makeFriendly(score)}{" "}
				</span>
				created: {dateCreated} awards:{" "}
				{all_awardings.map(({ name, description, icon_url, count }) => {
					return (
						<Award {...{ name, description, icon_url, count }} />
					);
				})}
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
