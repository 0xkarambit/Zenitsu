import React, { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

// stores
import { useKeyMappings } from "./../stores/keymappings.js";

const PostLoader = ({ loadMorePosts }) => {
	const loadMorekeys = useKeyMappings((s) => s.loadMorekeys);
	useHotkeys(loadMorekeys, () => loadMorePosts());
	// useHotkeys("m", () => loadMorePosts());

	return (
		<div>
			<button onClick={loadMorePosts}>loadMorePosts</button>
		</div>
	);
};

export default PostLoader;
