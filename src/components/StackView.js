
import {useRef, useEffect} from "react";
import {
	Link,
	useParams,
	useHistory
} from "react-router-dom";
import StackGrid from "react-stack-grid";
import Post from "./Post.js";
import { useHotkeys } from "react-hotkeys-hook";

const StackView = ({postsData, loadMorePosts, expandView, shouldBlurAll, postsSeen, lastSeen}) => {

	const {subreddit} = useParams();
	const history = useHistory()
	const grid = useRef();
	console.log({lastSeen})
	useHotkeys("s", () => {
		// todo: set last seen 
		history.push(`/${subreddit}/https://www.reddit.com${postsData[lastSeen].data.permalink}`);
	}, {}, [lastSeen])

	useEffect(()=>{
		setTimeout(() => {
			console.log(grid);
		}, 1000);
	}, [])

	return (
		<>
			<StackGrid
				monitorImagesLoaded={true}
				columnWidth={300}
				ref={grid}
			>
				{postsData.map((post, i) => (
					<Link
						to={`/${subreddit}/https://www.reddit.com${post.data.permalink}`}
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
			<Post
				loadMorePosts={loadMorePosts}
				postsLoader={true}
			></Post>
		</>
	)
}

export default StackView;