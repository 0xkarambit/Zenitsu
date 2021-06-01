import React, { useState, useEffect } from "react";

import Comment from "./Comment.js";

const CommentsSection = React.memo(
	({ getComments, currentPostData, currentComments, setCurrentComments }) => {
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
						Comments {currentPostData.num_comments}
					</h4>
					<SortByButton
						setComments={setComments}
						comments={comments}
						currentComments={currentComments}
					></SortByButton>
				</span>
				{/*todo: show loading comments banner */}
				{comments &&
					comments.map((commentObj) => {
						if (commentObj.kind === "more") return null;
						return (
							<Comment
								getComments={getComments}
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

const SortByButton = ({ setComments, comments, currentComments }) => {
	/*
	todo
	sort by datalist,
	1/3 * 98vw into a variable to use for photos/videos ???
	*/

	const [sortBy, setSortBy] = useState(null);

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
		auto: () => {
			setComments(currentComments);
		},
		upvotes: () => {
			setComments((coms) => {
				let c = [...coms];
				return c.sort(({ data: data1 }, { data: data2 }) => {
					return data2.ups - data1.ups;
				});
			});
		},
		new: () => {
			setComments((coms) => {
				let c = [...coms];
				return c.sort(({ data: data1 }, { data: data2 }) => {
					return data2.created_utc - data1.created_utc;
				});
			});
		},
		old: () => {
			console.log(comments);
			setComments((coms) => {
				// return [];
				let c = [...coms];
				return c.sort(({ data: data1 }, { data: data2 }) => {
					return data1.created_utc - data2.created_utc;
				});
			});
		},
		awards: () => {
			console.log(comments);
			setComments((coms) => {
				// we need immer for this now !!
				// also read wesbos's array destructuring articles
				// let c = [...coms];
				// c.shift();
				// return c;
				let c = [...coms];
				return c.sort(({ data: data1 }, { data: data2 }) => {
					console.log(data1, data2);
					console.log(
						data1.total_awards_received -
							data2.total_awards_received
					);
					return (
						data1.total_awards_received -
						data2.total_awards_received
					);
				});
				// console.log(sorted);
				// return sorted;
			});
		}
	};

	const sort = (e) => {
		sortingMethods[e.target.value]();
	};

	return (
		<select name="sortby" id="sortby" style={style} onChange={sort}>
			{Object.keys(sortingMethods).map((name) => (
				<option value={name}>{name}</option>
			))}
		</select>
	);
};

export default CommentsSection;

/*
SORTING NOT WORKING

since when do the award icons in comments go so high ??
*/
