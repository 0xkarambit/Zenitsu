import React from "react";

const Award = ({ name, description, icon_url, count }) => {
	return (
		<div className="award">
			<img src={icon_url} alt={name} className="tooltip" title={name} />
			<div className="tooltip-box">
				<img src={icon_url} alt={name} className="tooltip-box-img" />
				<div className="text">
					<p className="name">{name}</p>
					<p className="tooltip-desc">{description}</p>
				</div>
			</div>
			{count > 1 ? <p className="count">{count}</p> : null}
		</div>
	);
};

export default Award;
