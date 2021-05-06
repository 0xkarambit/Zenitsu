import LoadMoreComments from "./LoadMoreComments.js";
import "./Comment.css";

import arrowUp from "./../assets/icons/arrow-up.svg";

const Comment = ({
	data,
	ml = 0,
	topLevel = false,
	getComments,
	perma_link,
	setCurrentComments
}) => {
	if (data.total_awards_received) {
		console.log(data);
	}
	const marginLeft = {
		marginLeft: `${ml}px`
	};
	const icon = {
		width: "16px",
		height: "16px",
		paddingLeft: "2px"
		/* to align score with other comment details */
		// position: "relative",
		// top: "-1px"
	};
	// Comment is a recursive component.
	const mlinc = 20;
	let className = topLevel ? "toplevel comment" : "comment";
	let timeCreated = new Date(+`${data.created_utc}000`).toLocaleString();
	return (
		// using key as [commentObj]data.id idk how the id is used in reddit tho.
		<div className={className}>
			<p style={marginLeft} className="comment-details">
				<span className="userID">{`u/${data.author}`}</span>
				<span className="score">
					<img
						alt="arrow-up"
						src={arrowUp}
						style={icon}
						className="arrow"
					></img>
					{data.score}
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
				<p className="comment-text" style={marginLeft}>
					{data.body}
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

const Award = ({ name, description, icon_url, count }) => {
	return (
		<div className="award">
			<img src={icon_url} alt={name} className="tooltip" title={name} />
			<div className="tooltip-box">
				<img
					src={icon_url}
					alt={name}
					className="tooltip-box-img tooltip"
				/>
				<div className="text">
					<p className="name">{name}</p>
					<p className="tooltip-desc">{description}</p>
				</div>
			</div>
			{count > 1 ? <p className="count">{count}</p> : null}
		</div>
	);
};
