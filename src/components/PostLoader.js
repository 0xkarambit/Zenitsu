import React, { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const PostLoader = ({ loadMorePosts }) => {
	useHotkeys("m", () => loadMorePosts());

	return (
		<div>
			<button onClick={loadMorePosts}>loadMorePosts</button>
		</div>
	);
};

export default PostLoader;
