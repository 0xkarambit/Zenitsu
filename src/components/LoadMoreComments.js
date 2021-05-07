const LoadMoreComments = ({
	id,
	getComments,
	perma_link,
	setCurrentComments
}) => {
	const load = () => {
		let url = "https://www.reddit.com" + perma_link + "/" + id + ".json";
		getComments(url).then((comObj) => {
			if (comObj === 1) {
				alert("likely fetch request went wrong");
				return null;
			}
			// console.log(comObj);
			setCurrentComments(comObj.comments);
		});
	};
	return (
		// todo: show how many to load
		<button class="comments-loader" onClick={load}>
			load more comments {id}
		</button>
	);
};

export default LoadMoreComments;
