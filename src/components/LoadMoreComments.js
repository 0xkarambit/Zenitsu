const LoadMoreComments = ({
	data,
	getComments,
	perma_link,
	setCurrentComments
}) => {
	const load = () => {
		console.log(data.id);
		return null;
		let url =
			"https://www.reddit.com" + perma_link + "/" + data.id + ".json";
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
		<button className="comments-loader" onClick={load}>
			{/*load more comments */}
			{data.id} {data.name}
		</button>
	);
};

export default LoadMoreComments;
