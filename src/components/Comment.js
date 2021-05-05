import LoadMoreComments from "./LoadMoreComments.js";
import "./Comment.css";

const Comment = ({
	data,
	ml = 0,
	topLevel = false,
	getComments,
	perma_link,
	setCurrentComments
}) => {
	const style = { marginLeft: `${ml}px` };
	// Comment is a recursive component.
	const mlinc = 20;
	let className = topLevel ? "toplevel comment" : "comment";
	return (
		// using key as [commentObj]data.id idk how the id is used in reddit tho.
		<div className={className}>
			<p className="userID" style={style}>{`u/${data.author}`}</p>
			<div>
				<p className="comment-text" style={style}>
					{" "}
					{data.body}{" "}
				</p>
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
		</div>
	);
};

export default Comment;
