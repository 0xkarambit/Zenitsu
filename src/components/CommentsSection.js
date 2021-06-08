import React, { useState, useEffect, useRef } from "react";
import { makeFriendly } from "../utils/num.js";

import Comment from "./Comment.js";
// stores
import { useCommentsStore } from "./../stores/commentsStore.js";

const CommentsSection = React.memo(
	({ currentPostData, currentComments, setCurrentComments, permalink }) => {
		const [comments, setComments] = useState(currentComments);

		useEffect(() => {
			setComments(currentComments);
		}, [currentComments]);

		return (
			<div className="comments">
				<span className="details">
					<h4
						className="comments-section-banner"
						style={{ margin: "12px 0px -2px 12px" }}
					>
						Comments {makeFriendly(currentPostData.num_comments)}
					</h4>
					<SortByButton
						setComments={setComments}
						comments={comments}
						currentComments={currentComments}
						permalink={permalink}
						key="sortByButton"
					></SortByButton>
				</span>
				{/*todo: show loading comments banner */}
				{comments &&
					comments.map((commentObj) => {
						if (commentObj.kind === "more") return null;
						return (
							<Comment
								data={commentObj.data}
								topLevel={true}
								key={commentObj.data.id}
								perma_link={
									currentPostData.perma_link || "permalink"
								}
								setCurrentComments={setCurrentComments}
							/>
						);
					})}
			</div>
		);
	}
);

const SortByButton = ({
	setComments,
	comments,
	currentComments,
	permalink
}) => {
	/*
	todo
	remember sortBy for different posts
	selected value getshighlighted but comments dont get sorted accordingly.

	same thing need to be done for collaping comments.
	*/
	const { sortBy, setSortBy, changeCommentObj } = useCommentsStore();

	// ?sort=new
	// https://www.reddit.com/r/pics/comments/nqiod2/the_columbia_crew_in_orbit_recovered_from/.json?sort=new
	const style = {
		position: "relative",
		top: "5px",
		border: "none",
		margin: "10px",
		// padding: "4px"
		color: "#1c1412",
		backgroundColor: "var(--dim-bg)",
		fontSize: "0.8em",
		borderRadius: "6px"
	};

	// not working currently
	const sortingMethods = {
		// ya auto doesnt work anymore now.
		auto: () => {
			setComments(currentComments);
			return currentComments;
		},
		upvotes: () => {
			let l = [];
			setComments((coms) => {
				let c = [...coms];
				l = c.sort(({ data: data1 }, { data: data2 }) => {
					return data2.ups - data1.ups;
				});
				// ! gets called twice, hmm
				changeCommentObj(permalink, { link: permalink, comments: l });
				return l;
			});
			return l;
		},
		new: () => {
			let l = [];
			setComments((coms) => {
				let c = [...coms];
				l = c.sort(({ data: data1 }, { data: data2 }) => {
					return data2.created_utc - data1.created_utc;
				});
				changeCommentObj(permalink, { link: permalink, comments: l });
				return l;
			});
			return l;
		},
		old: () => {
			console.log(comments);
			let l = [];
			setComments((coms) => {
				let c = [...coms];
				l = c.sort(({ data: data1 }, { data: data2 }) => {
					return data1.created_utc - data2.created_utc;
				});
				changeCommentObj(permalink, { link: permalink, comments: l });
				return l;
			});
			return l;
		},
		awards: () => {
			console.log(comments);
			let l = [];
			setComments((coms) => {
				let c = [...coms];
				l = c.sort(
					({ data: data1 }, { data: data2 }) =>
						data2.total_awards_received -
						data1.total_awards_received
				);
				changeCommentObj(permalink, { link: permalink, comments: l });
				return l;
				// console.log(sorted);
				// return sorted;
			});
			// l is [] because of delayed assignment.
			return l;
		}
	};

	const sort = (e) => {
		sortingMethods[e.target.value]();
		// console.log("TESTSYT");
		// console.log(comms);
		// changeCommentObj(permalink, { link: permalink, comments: comms });

		// maybe double alert/calling/selection is because of this ???
		setSortBy({
			[permalink]: e.target.value
		});
	};

	return (
		<select name="sortby" id="sortby" style={style} onChange={sort}>
			{Object.keys(sortingMethods).map((name) => (
				<option value={name} selected={sortBy[permalink] === name}>
					{name}
				</option>
			))}
		</select>
	);
};

export default CommentsSection;
