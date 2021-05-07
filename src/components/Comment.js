import LoadMoreComments from "./LoadMoreComments.js";
import "./Comment.css";

import arrowUp from "./../assets/icons/arrow-up.svg";
import Award from "./Award.js";

import { makeFriendly } from "./../utils/num.js";

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
					dangerouslySetInnerHTML={parse(data.body_html)}
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

function parse(body_html) {
	// nope we need something better
	let map = {
		"&quot;": '"',
		"&apos;": "'",
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&nbsp;": " ",
		"&iexcl;": "¡",
		"&cent;": "¢",
		"&pound;": "£",
		"&curren;": "¤",
		"&yen;": "¥",
		"&brvbar;": "¦",
		"&sect;": "§",
		"&uml;": "¨",
		"&copy;": "©",
		"&ordf;": "ª",
		"&laquo;": "«",
		"&not;": "¬",
		"&shy;": "­",
		"&reg;": "®",
		"&macr;": "¯",
		"&deg;": "°",
		"&plusmn;": "±",
		"&sup2;": "²",
		"&sup3;": "³",
		"&acute;": "´",
		"&micro;": "µ",
		"&para;": "¶",
		"&middot;": "·",
		"&cedil;": "¸",
		"&sup1;": "¹",
		"&ordm;": "º",
		"&raquo;": "»",
		"&frac14;": "¼",
		"&frac12;": "½",
		"&frac34;": "¾",
		"&iquest;": "¿",
		"&times;": "×",
		"&divide;": "÷",
		"&Agrave;": "À",
		"&Aacute;": "Á",
		"&Acirc;": "Â",
		"&Atilde;": "Ã",
		"&Auml;": "Ä",
		"&Aring;": "Å",
		"&AElig;": "Æ",
		"&Ccedil;": "Ç",
		"&Egrave;": "È",
		"&Eacute;": "É",
		"&Ecirc;": "Ê",
		"&Euml;": "Ë",
		"&Igrave;": "Ì",
		"&Iacute;": "Í",
		"&Icirc;": "Î",
		"&Iuml;": "Ï",
		"&ETH;": "Ð",
		"&Ntilde;": "Ñ",
		"&Ograve;": "Ò",
		"&Oacute;": "Ó",
		"&Ocirc;": "Ô",
		"&Otilde;": "Õ",
		"&Ouml;": "Ö",
		"&Oslash;": "Ø",
		"&Ugrave;": "Ù",
		"&Uacute;": "Ú",
		"&Ucirc;": "Û",
		"&Uuml;": "Ü",
		"&Yacute;": "Ý",
		"&THORN;": "Þ",
		"&szlig;": "ß",
		"&agrave;": "à",
		"&aacute;": "á",
		"&acirc;": "â",
		"&atilde;": "ã",
		"&auml;": "ä",
		"&aring;": "å",
		"&aelig;": "æ",
		"&ccedil;": "ç",
		"&egrave;": "è",
		"&eacute;": "é",
		"&ecirc;": "ê",
		"&euml;": "ë",
		"&igrave;": "ì",
		"&iacute;": "í",
		"&icirc;": "î",
		"&iuml;": "ï",
		"&eth;": "ð",
		"&ntilde;": "ñ",
		"&ograve;": "ò",
		"&oacute;": "ó",
		"&ocirc;": "ô",
		"&otilde;": "õ",
		"&ouml;": "ö",
		"&oslash;": "ø",
		"&ugrave;": "ù",
		"&uacute;": "ú",
		"&ucirc;": "û",
		"&uuml;": "ü",
		"&yacute;": "ý",
		"&thorn;": "þ",
		"&yuml;": "ÿ",
		"&#39;": "'" // todo: some of these tags are not working.
	};

	let parsed = "";
	Object.keys(map).forEach((key) => {
		if (body_html.includes(key)) {
			parsed = body_html.replaceAll(key, map[key]);
		}
	});
	// for some reason it doesnt decode the "<" so we have to do it again
	return { __html: parsed.replaceAll("&lt;", "<") };
}
