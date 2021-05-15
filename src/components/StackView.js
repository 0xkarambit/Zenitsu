
import {
	Link,
	useParams,
	useHistory
} from "react-router-dom";
import StackGrid from "react-stack-grid";
import Post from "./Post.js";
import { useHotkeys } from "react-hotkeys-hook";

const StackView = ({postsData, loadMorePosts, expandView, shouldBlurAll}) => {

	const {subreddit} = useParams();
	const history = useHistory()
	useHotkeys("s", () => {
		history.push(`/${subreddit}/https://www.reddit.com${postsData[0].data.permalink}`);
	})

	return (
		<>
			<StackGrid
				monitorImagesLoaded={true}
				columnWidth={300}
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