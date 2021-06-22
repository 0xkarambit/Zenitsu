import { useMemo, useState, useEffect, useRef } from "react";
// https://github.com/remarkjs/react-markdown
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import MarkdownIt from "markdown-it";
import { useRouteMatch, Link } from "react-router-dom";

import ReactPlayer from "react-player";
import VideoPlayer from "./VideoPlayer.js";
import ImageGallery from "./ImageGallery.js";
import Award from "./Award.js";

import { makeFriendly, elapsedTime } from "./../utils/num.js";
import {
	convertHTMLEntityV2,
	convertHTMLEntityORG
} from "./../utils/htmlparsing.js";

import { BiLinkExternal } from "react-icons/bi";
import { BiUpvote } from "react-icons/bi";

import "./Post.css";
import { useHotkeys } from "react-hotkeys-hook";

/*todo: should i give option to user to switch markdown libraries */

const md = new MarkdownIt();

function filterSelftext(txt) {
	return txt.replace(/&nbsp;|| /, "");
}

export default function Post({
	subreddit,
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
	removed_by_category,
	secure_media,
	displayMode = "stack",
	shouldBlur,
	setBlur,
	expandView = () => {},
	index,
	viewStyle,
	shouldBlurAll = true,
	opened = false,
	setPostsSeen,
	dStyle,
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
	const {
		params: { sub }
	} = useRouteMatch("/r/:sub");
	const link = `https://www.reddit.com${permalink}`;
	const badThumbnails = ["", "self", "spoiler", "default"];
	// const imageUrl = preview.images[0].resolutions[] // these urls dont work restricted BUT url will work here
	const videoWidth = secure_media?.reddit_video?.width;
	const videoHeight = secure_media?.reddit_video?.height;
	const is_gif = secure_media?.reddit_video?.is_gif;
	// todo: oh there can be multiple photos
	const imgWidth = preview?.images[0]?.source?.width;
	const imgHeight = preview?.images[0]?.source?.height;
	const timeCreated = +`${created_utc}000`;
	// idk if we should really be using useMemo here or not.
	const gallery = useMemo(() => gallery_data?.items, [gallery_data]);
	// idk if its useful or not rn.
	const p = useRef();
	// const seen = postsSeen.has(permalink) ? "seen" : "";
	// todo: cleanup => set Last post to this index, and mark as seen on mount.
	// ok wwait does the post even get unmounted ??? NO i guess it only gets re rendered with new props.
	// so lets watch for props that may change.

	const [isTitleCollapsed, setIsTitleCollapsed] = useState(false);

	// to expand the collapsed title on post change
	useEffect(() => {
		setIsTitleCollapsed(false);
	}, [permalink]);

	useHotkeys(
		"z",
		() => {
			console.log(filterSelftext(convertHTMLEntityORG(title)));
			if (filterSelftext(convertHTMLEntityORG(title)).length > 100) {
				setIsTitleCollapsed((t) => !t);
			}
		},
		null,
		[title]
	);

	const markdownList = useMemo(() => {
		if (!selftext || displayMode === "focus") return null;
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

	// ? dStyle means only images | the only img check if already performed in StackView.
	// todo but still what about FocusMode ya return something else... for that time.
	// console.table({
	// 	1: dStyle,
	// 	2: !badThumbnails.includes(thumbnail),
	// 	3: post_hint === "image"
	// });

	// !! should be a new component ?? YES
	if (
		dStyle === "imgOnly" &&
		["image", "hosted:video", "rich:video"].includes(post_hint)
	) {
		if (displayMode === "stack") {
			const imgOnly = {
				maxWidth: "100%",
				objectFit: "contain",
				margin: "auto",
				width: preview.images[0].source.width
			};
			if (post_hint === "image") {
				return (
					<div className={c}>
						<img
							style={imgOnly}
							src={url}
							alt="thumbnail"
							className={
								shouldBlurAll && over_18 ? "blur" : ""
							} /* bad solution well its not like
						we could unblur the thumbnails before but we need a state management
						sys to take care of this*/
						></img>
					</div>
				);
			} else if (post_hint === "hosted:video") {
				// else is_video?
				return (
					<div className="center-cont">
						<VideoPlayer
							videoUrl={url + "/DASH_1080.mp4?source=fallback"}
							audioUrl={url + "/DASH_audio.mp4?source=fallback"}
							poster={thumbnail}
							blur={false}
							loop={is_gif}
							style={imgOnly}
							muted={dStyle === "imgOnly"}
							// ! resposiveness wont work for this rn. cause src is not right
							width={videoWidth}
							// height={videoHeight}
						/>
					</div>
				);
			} else if (post_hint === "rich:video") {
				return (
					<div>
						<ReactPlayer
							style={imgOnly}
							width={videoWidth}
							url={url}
							controls
							pip
							autoplay={is_gif}
						/>
					</div>
				);
			}
		}
		if (displayMode === "focus") {
			const imgOnly = {
				maxWidth: "90vw",
				maxHeight: "90vh",
				objectFit: "contain",
				margin: "auto",
				width: preview.images[0].source.width,
				height: preview.images[0].source.height
			};
			const center = {
				display: "grid",
				justifyContent: "center",
				alignItems: "center",
				height: "90vh"
			};
			if (post_hint === "image") {
				return (
					<div className="center-cont" style={center}>
						<img
							height={imgHeight}
							src={url}
							alt="thumbnail"
							// className={shouldBlur ? "blur post-img" : "post-img"}
							style={imgOnly}
							onClick={() => {
								setBlur(false); // we have to reset it on change, ok keep an array of this.
							}}
							// wait do i need to blur text too ? yes
							// todo: better yet https://stackoverflow.com/questions/11977103/blur-effect-on-a-div-element
						></img>
					</div>
				);
			} else if (post_hint === "hosted:video") {
				// else is_video?
				return (
					<div className="center-cont" style={center}>
						<VideoPlayer
							videoUrl={url + "/DASH_1080.mp4?source=fallback"}
							audioUrl={url + "/DASH_audio.mp4?source=fallback"}
							poster={thumbnail}
							blur={false}
							loop={is_gif}
							width={videoWidth}
							height={videoHeight}
						/>
					</div>
				);
			} else if (post_hint === "rich:video") {
				return (
					<div className="center-cont" style={center}>
						<ReactPlayer
							width={videoWidth}
							url={url}
							controls
							pip
							autoplay={is_gif}
						/>
					</div>
				);
			}
		}
	}

	return (
		<div
			className={c}
			onClick={() => {
				// yes this must be responsible for the opening on click
				expandView(index);
				// document.querySelector("#root").scrollIntoView();
			}}
			data-view-vert={displayMode === "stack" ? null : viewStyle}
			ref={p}
		>
			{sub === "all" ? (
				<p className="author" style={{ fontWeight: 560 }}>
					<Link to={`/r/${subreddit}`}>{`r/${subreddit}`}</Link>
					<span style={{ fontWeight: 400 }}>
						{" "}
						posted by {`u/${author}`}
					</span>
				</p>
			) : (
				<p className="author">{`u/${author}`}</p>
			)}

			<h2
				className="title"
				style={{
					opacity: isTitleCollapsed ? "75%" : "100%"
				}}
				onClick={() => setIsTitleCollapsed(false)}
				title={
					isTitleCollapsed
						? "click to expand title"
						: "collapse title with z"
				}
			>
				{isTitleCollapsed
					? `${filterSelftext(convertHTMLEntityORG(title)).slice(
							0,
							100
					  )}...`
					: filterSelftext(convertHTMLEntityORG(title))}
				{/*TODO: the message in thumbnail could be something else too right ya, browser reddit to know more*/}
				{thumbnail === "spoiler" && (
					<span className="spoiler">SPOILER</span>
				)}
			</h2>
			{/*todo: should i give option to user to switch markdown libraries 
				? currently using a combo of both, but we dont render tables in stackView mode.
			*/}
			{displayMode === "focus" ? (
				<div
					className="postbody"
					dangerouslySetInnerHTML={{
						// ! wait does selftext not contain characters to escape ?
						// todo >!113 to 84!< marks spoiler !!;
						__html: md.render(
							filterSelftext(convertHTMLEntityORG(selftext))
						)
					}}
				/>
			) : (
				<div className="postbody">{markdownList}</div>
			)}
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
			{/*! displayMode focus stuff*/}
			{(() => {
				if (displayMode === "focus") {
					if (removed_by_category === "moderator") {
						return (
							<span class="removed_notice">
								post removed by mods.
							</span>
						);
					}
					{
						/*todo: disabled for some time
						if (is_gallery === true) {
											return <ImageGallery gallery={gallery} media_metadata={media_metadata}/>;
										}*/
					}
					if (post_hint === "image") {
						return (
							<img
								// specify neither and we get rid of both extra height (in vert=split) & center align issues
								// height={imgHeight} // width={imgWidth}
								src={url}
								alt="post-img"
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
								// width={videoWidth}
								// height={videoHeight}
							/>
						);
					} else if (post_hint === "rich:video") {
						return (
							<ReactPlayer
								width={viewStyle ? "100%" : videoWidth}
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
						if (
							![undefined, "url", "link", "self"].includes(
								post_hint
							)
						) {
							// self post, meaning it doesn't link outside of reddit. It can also be called a 'text post'. check is_self on obj
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
					<BiUpvote className="upvote-icon"></BiUpvote>
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
			</span>
			{/*? .fs-15 temporary fix for the inconsistent font size 
				& all_awardings.length > 0 checked to avoid rendering <span>
			*/}
			{all_awardings.length > 0 && (
				<span className="awards fs-15">
					{all_awardings.map(
						({ name, description, icon_url, count }) => {
							return (
								<Award
									{...{ name, description, icon_url, count }}
								/>
							);
						}
					)}
				</span>
			)}
			{/* <div className="speech">
				<Speech stop={true} pause={true} resume={true} text={title} />
			</div> */}
		</div>
	);
	// score, total_awards_received
}
