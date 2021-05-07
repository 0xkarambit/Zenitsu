import LoadMoreComments from "./LoadMoreComments.js";
import "./Comment.css";

import arrowUp from "./../assets/icons/arrow-up.svg";
import Award from "./Award.js";

import { makeFriendly } from "./../utils/num.js";
import { convertHTMLEntity } from "./../utils/htmlparsing.js";

const Comment = ({
	data,
	ml = 0,
	topLevel = false,
	getComments,
	perma_link,
	setCurrentComments
}) => {
	const icon = {
		width: "16px",
		height: "16px",
		paddingLeft: "2px"
		/* to align score with other comment details */
		// position: "relative",
		// top: "-1px"
	};
	// Comment is a recursive component.
	const mlinc = 0;
	const marginLeft = {
		marginLeft: `${14}px`
	};
	const commentMarginLeft = {
		marginLeft: `${14}px`
	};
	let className = topLevel ? "toplevel-comment" : "comment";
	let timeCreated = new Date(+`${data.created_utc}000`).toLocaleString();
	if (data.body.includes("SpaceX")) {
		console.log({ j: data.body_html });
	}
	return (
		// using key as [commentObj]data.id idk how the id is used in reddit tho.
		<div className={className} style={commentMarginLeft}>
			<p style={marginLeft} className="comment-details">
				<span className="userID">{`u/${data.author}`}</span>
				<span className="score">
					<img
						alt="arrow-up"
						src={arrowUp}
						style={icon}
						className="arrow"
					></img>
					{makeFriendly(data.score)}
				</span>
				<span className="time-posted">{timeCreated}</span>
				<span className="awards">
					{data.all_awardings.map(
						({ name, description, icon_url, count }) => {
							return (
								<Award
									{...{ name, description, icon_url, count }}
								/>
							);
						}
					)}
				</span>
			</p>
			<div>
				<p
					className="comment-text"
					style={marginLeft}
					dangerouslySetInnerHTML={convertHTMLEntity(data.body_html)}
				></p>
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
