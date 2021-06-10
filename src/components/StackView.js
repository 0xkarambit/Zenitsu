import { useRef, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import StackGrid from "react-stack-grid";
import Post from "./Post.js";
import PostLoader from "./PostLoader.js";

import { useHotkeys } from "react-hotkeys-hook";

const StackView = ({
	postsData,
	loadMorePosts,
	expandView,
	shouldBlurAll,
	postsSeen,
	lastSeen,
	dStyle
}) => {
	const { subreddit } = useParams();
	const history = useHistory();
	const grid = useRef();

	// loadListings on: sub change, mount !
	// unload on unmount ? NO do that only in thought.js sub
	useEffect(() => {
		if (grid) {
			// ok never use ref.current in an if condition.
			setTimeout(() => {
				// this doesnt actually work lol. all this hardwork is in vain. MAYBE IT DOES !!
				grid.current?.updateLayout();
				// make a map of the layout elements and then use.
			}, 2500); // 3000 ms is a guess lol.
		}
	}, [subreddit]); // todo: use in thought.js too

	useHotkeys(
		"s",
		() => {
			// todo: set last seen
			// get over here
			// this was not working because of the
			if (postsData[lastSeen]?.data?.permalink) {
				history.push(
					`/r/${subreddit}/https://www.reddit.com${postsData[lastSeen].data.permalink}`
				);
			} else {
				alert("WHAT");
				console.log(postsData[lastSeen]);
			}
		},
		{},
		[lastSeen, postsData]
	);

	// do we need this ???
	useHotkeys("r", () => grid.current?.updateLayout());

	useHotkeys("m", () => {
		// onLayout prop on StackGrid
		// i can calculate the ColCount using the width of each GridItem and gutter and total width available.
		console.log(grid.current);
		console.log(grid.current.grid.items[".1"].node);
	});

	// console.log(rect); getDimensions hook
	// useLayoutEffect(() => {

	// }, [])

	// to update layout on dStyle switch
	useEffect(() => {
		grid.current?.updateLayout();
	}, [dStyle]);

	/*
	! wait try to render the img/video/gif directly here only !!
	post.data.thumbnail_height
	post.data.thumbnail_width
	*/
	const imgOnlyProps = {
		gutter: 100
	};

	// change columnWidth in imgOnly mode.
	const [dStyleWidth, setDStyleWidth] = useState(300);
	const delta = 50;
	const maxVal = 1300; // but this is just for my pc lol.
	const minVal = 150; // but this is just for my pc lol.
	const limit = (val) =>
		val > maxVal ? maxVal : val < minVal ? minVal : val;

	useHotkeys("shift + =", () => {
		setDStyleWidth((w) => limit(w + delta));
		grid.current?.updateLayout();
	});
	useHotkeys("shift + -", () => {
		setDStyleWidth((w) => limit(w - delta));
		grid.current?.updateLayout();
	});

	return (
		<>
			<StackGrid
				monitorImagesLoaded={true}
				// should be img width on imgOnly dStyle
				columnWidth={dStyle === "imgOnly" ? dStyleWidth : 300}
				// columnWidth={300}
				gridRef={(r) => (grid.current = r)}
			>
				{postsData.map((post, i) => {
					// ! verify if it actually has an img !
					if (
						dStyle === "imgOnly" &&
						!["image", "hosted:video", "rich:video"].includes(
							post.data.post_hint
						)
					)
						return null;
					return (
						<Link
							// to={`/${subreddit}/https://www.reddit.com${post.data.permalink}`}
							to={`/r/${subreddit}/https://www.reddit.com${post.data.permalink}`}
							style={{ textDecoration: "none" }}
							// get over here
							onClick={() => expandView(i)}
						>
							<Post
								key={i}
								index={i}
								{...post.data}
								expandView={expandView}
								shouldBlurAll={shouldBlurAll}
								opened={postsSeen.has(post.data.permalink)}
								dStyle={dStyle}
							></Post>
						</Link>
					);
				})}
			</StackGrid>
			<PostLoader loadMorePosts={loadMorePosts} />
		</>
	);
};

export default StackView;

/*
<img
								src={post.data.url}
								alt={post.data?.title}
								stylee
								width={post.data.preview.images[0].source.width}
								height={
									post.data.preview.images[0].source.height
								}
							/>
*/
