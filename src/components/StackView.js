import { useState, useRef, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import StackGrid from "react-stack-grid";
import Post from "./Post.js";
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

	useEffect(() => {
		// resizeGrid();
		if (grid) {
			// ok never use ref.current in an if condition.
			setTimeout(() => {
				// this doesnt actually work lol. all this hardwork is in vain. MAYBE IT DOES !!
				grid.current?.updateLayout();
			}, 2500); // 3000 ms is a guess lol.
		}
	}, [subreddit]); // todo: use in thought.js too

	useHotkeys(
		"s",
		() => {
			// todo: set last seen
			history.push(
				`/r/${subreddit}/https://www.reddit.com${postsData[lastSeen].data.permalink}`
			);
		},
		{},
		[lastSeen]
	);

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
						to={(location) =>
							`${location.pathname}/https://www.reddit.com${post.data.permalink}`
						}
						style={{ textDecoration: "none" }}
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
			<Post loadMorePosts={loadMorePosts} postsLoader={true}></Post>
		</>
	);
};

export default StackView;
