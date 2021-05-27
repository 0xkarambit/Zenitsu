import { useMemo, useState, useEffect, useRef } from "react";
// https://github.com/remarkjs/react-markdown
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import ReactPlayer from "react-player";
import VideoPlayer from "./VideoPlayer.js";
import ImageGallery from "./ImageGallery.js";
import Award from "./Award.js";

import { makeFriendly, elapsedTime } from "./../utils/num.js";
import { convertHTMLEntityV2 } from "./../utils/htmlparsing.js";

import { BiLinkExternal } from "react-icons/bi";
import { BiUpvote } from "react-icons/bi";

import "./Post.css";

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
	is_gallery,
	gallery_data,
	media_metadata,
	secure_media,
	displayMode = "stack",
	shouldBlur,
	setBlur,
	expandView = () => {},
	index,
	viewStyle,
	loadMorePosts = false,
	postsLoader = false,
	shouldBlurAll = true,
	opened = false,
	setPostsSeen,
	setLastSeen,
	data
}) {
	// moved to the bottom hooks were getting in the way lol.
	// if (postsLoader) {
	// 	return (
	// 		<div className="post">
	// 			<button onClick={loadMorePosts}>loadMorePosts</button>
	// 		</div>
	// 	);
	// }
	const link = `https://www.reddit.com${permalink}`;
	const badThumbnails = ["", "self", "spoiler", "default"];
	// const imageUrl = preview.images[0].resolutions[] // these urls dont work restricted BUT url will work here
	const width = secure_media?.reddit_video?.width;
	const is_gif = secure_media?.reddit_video?.is_gif;
	// todo: oh there can be multiple photos
	const imgWidth = preview?.images[0]?.source?.width;
	const timeCreated = +`${created_utc}000`;
	// idk if we should really be using useMemo here or not.
	const gallery = useMemo(() => gallery_data?.items, [gallery_data]);
	// idk if its useful or not rn.
	const p = useRef();
	// const seen = postsSeen.has(permalink) ? "seen" : "";
	// todo: cleanup => set Last post to this index, and mark as seen on mount.
	// ok wwait does the post even get unmounted ??? NO i guess it only gets re rendered with new props.
	// so lets watch for props that may change.

	const markdownList = useMemo(() => {
		if (!selftext) return null;
		console.log({ selftext });
		let c = displayMode === "focus" ? Infinity : 200;
		// return convertHTMLEntityV2(selftext).map((v) => {
		// 	return <ReactMarkdown className="post-body-p">{v}</ReactMarkdown>
		// });
		let cl_name = displayMode === "focus" ? "post-body-p" : "";
		let l = [];
		for (let line of convertHTMLEntityV2(selftext)) {
			c = c - line.length;
			if (c < 0) break;
			let elm = (
				// i think adding a classname make it not work properly
				// <ReactMarkdown remarkPlugins={[gfm]} className={cl_name}>
				<ReactMarkdown remarkPlugins={[gfm]}>{line}</ReactMarkdown>
			);
			l.push(elm);
		}
		return l;
	}, [selftext, displayMode]);

	// https://www.reddit.com/r/Superstonk/comments/nlwqyv/house_of_cards_part_3/

	if (post_hint?.includes("video")) {
		console.log(data);
	}

	useEffect(() => {
		if (displayMode === "focus") {
			// maybe i shouldnt replace it with postsSeen
			if (!opened) {
				setPostsSeen((seen) => new Set([...seen, permalink]));
			}
		}
	}, [permalink]);

	// OH YES I GOT IT MOVE OPENED TO PROPS.
	// wont work because it gets unmounted when we change view.
	const c = displayMode === "focus" ? "post" : opened ? "seen post" : "post";
	return postsLoader ? (
		<div className="post">
			<button onClick={loadMorePosts}>loadMorePosts</button>
		</div>
	) : (
		<div
			className={c}
			onClick={() => {
				// yes this must be responsible for the opening on click
				expandView(index);
			}}
			data-view-vert={displayMode === "stack" ? null : viewStyle}
			ref={p}
		>
			<p className="author">{`u/${author}`}</p>
			<h2 className="title">
				{title || "title"}
				{/*TODO: the message in thumbnail could be something else too right ya, browser reddit to know more*/}
				{thumbnail === "spoiler" && (
					<span className="spoiler">SPOILER</span>
				)}
			</h2>
			<div className="postbody">{markdownList}</div>
			{/* IMAGE imlementaion region */}
			{displayMode === "stack" && !badThumbnails.includes(thumbnail) && (
				<img
					src={thumbnail}
					alt="thumbnail"
					className={
						shouldBlurAll && over_18 ? "blur" : ""
					} /* bad solution well its not like
					we could unblur the thumbnails before but we need a state management 
					sys to take care of this*/
				></img>
			)}
			{(() => {
				if (displayMode === "focus") {
					{
						/*todo: disabled for some time
						if (is_gallery === true) {
											return <ImageGallery gallery={gallery} media_metadata={media_metadata}/>;
										}*/
					}
					if (post_hint === "image") {
						return (
							<img
								width={imgWidth}
								src={url}
								alt="thumbnail"
								style={{ objectFit: "contain" }}
								className={
									shouldBlur ? "blur post-img" : "post-img"
								}
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
								loop={is_gif}
								width={width}
							/>
						);
					} else if (post_hint === "rich:video") {
						return (
							<ReactPlayer
								width={width}
								url={url}
								controls
								pip
								autoplay={is_gif}
							/>
						);
					} else {
						if (post_hint === "link" || is_gallery === true) {
							return (
								<div className="incomprehensible_post_hint">
									{/*<span className="domain">{domain}</span> DOESNT LOOK GOOD RIGHT NOW SHOW AFTER REDESIGN todo: SHOULD I USE url_overridden_by_dest or url ?*/}
									<span className="url">
										<a
											href={url}
											target="_blank"
											rel="noreferrer"
										>
											{url_overridden_by_dest}
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
				<span title={score} style={{ margin: "0px 5px 0px 5px" }}>
					<BiUpvote></BiUpvote>
					{makeFriendly(score)}{" "}
				</span>
				<p>{elapsedTime(timeCreated)}</p>
				<a
					className="reddit-post-link"
					href={link}
					target="_blank"
					rel="noreferrer"
					tabindex={displayMode === "focus" ? 0 : -1}
					// todo: fix this when pressing tab the focused <a> doesnt get highlighted with outline
				>
					<BiLinkExternal title="view post on reddit" />
				</a>
				{all_awardings.map(({ name, description, icon_url, count }) => {
					return (
						<Award {...{ name, description, icon_url, count }} />
					);
				})}
			</span>
			{/* <div className="speech">
				<Speech stop={true} pause={true} resume={true} text={title} />
			</div> */}
		</div>
	);
	// score, total_awards_received
}
