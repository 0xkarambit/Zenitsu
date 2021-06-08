import { useState, useRef, useEffect } from "react";
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
	lastSeen
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

	useHotkeys("m", () => {
		// onLayout prop on StackGrid
		// i can calculate the ColCount using the width of each GridItem and gutter and total width available.
		console.log(grid.current);
		console.log(grid.current.grid.items[".1"].node);
	});

	// console.log(rect); getDimensions hook
	// useLayoutEffect(() => {

	// }, [])

	return (
		<>
			<StackGrid
				monitorImagesLoaded={true}
				columnWidth={300}
				gridRef={(r) => (grid.current = r)}
			>
				{postsData.map((post, i) => (
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
						></Post>
					</Link>
				))}
			</StackGrid>
			<PostLoader loadMorePosts={loadMorePosts} />
		</>
	);
};

export default StackView;
