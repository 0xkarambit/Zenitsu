import LoadMoreComments from "./LoadMoreComments.js";

const Comment = ({
	data,
	ml = 0,
	topLevel = false,
	getComments,
	perma_link,
	setCurrentComments
}) => {
	// Comment is a recursive component.
	const styles = {
		marginLeft: `${ml}px`,
		marginBottom: `5px`,
		borderBottom: `dashed #e2e2e2 1px`,
		width: "auto" // doesnt fix the border extending beyond the text.
	};
	const mlinc = 20;
	let className = topLevel ? "toplevel comment" : "comment";
	return (
		// using key as [commentObj]data.id idk how the id is used in reddit tho.
		<div className={className}>
			<p style={styles}> {data.body} </p>
			{data.replies !== "" &&
				data.replies.data.children.map((replyData) => {
					// replyData is a standard comment Obj
					if (replyData.kind === "more") {
						return (
							<LoadMoreComments
								{...{
									id: replyData.id,
									getComments,
									perma_link,
									setCurrentComments
								}}
							/>
						);
					}
					// todo: return a <load more/> component;
					return (
						<Comment
							data={replyData.data}
							ml={ml + mlinc}
							key={replyData.data.id}
							getComments={getComments}
							{...{
								id: replyData.id,
								perma_link,
								setCurrentComments
							}}
						/>
					);
					// {data.replies && <Comment data={data.replies.data.children}></Comment>}
				})}
		</div>
	);
};

export default Comment;
