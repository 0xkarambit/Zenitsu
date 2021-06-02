function intlFormat(num) {
	return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
}
function makeFriendly(num) {
	if (num >= 1000000) return intlFormat(num / 1000000) + "M";
	if (num >= 1000) return intlFormat(num / 1000) + "k";
	return intlFormat(num);
}

// todo: i think i can implement this...
function elapsedTime(time) {
	let a = new Date(time);
	let b = new Date();
	let passed = (b - a) / 1000; // no of seconds passed

	// seconds
	let mag = passed;
	let prim = "sec";
	let sec = null;

	// for minutes
	if (mag / 60 > 1) {
		mag = mag / 60;
		prim = "min";
		// for hours
		if (mag / 60 > 1) {
			mag = mag / 60;
			prim = "hour";
			sec = "min";
			// for days
			if (mag / 24 > 1) {
				mag = mag / 24;
				prim = "day"; // day | days
				sec = "hour";
				// for months
				if (mag / 30 > 1) {
					mag = mag / 30;
					prim = "month"; // day | days
					sec = "day";
					// for years
					if (mag / 365 > 1) {
						mag = mag / 365;
						prim = "year"; // day | days
						sec = "month";
					}
				}
			}
		}
	} // else return

	let afterDot = mag - Math.floor(mag);
	mag = Math.floor(mag);

	// todo: idk if the secondary unit is really working or not
	if (afterDot > 1) return `${mag} ${prim} & ${afterDot} ${sec} ago`;
	// return afterDot >= 2
	// 	? `${mag} ${prim} & ${afterDot} ${sec}s ago`
	// 	: `${mag} ${prim} & ${afterDot} ${sec} ago`;

	return mag >= 2 ? `${mag} ${prim}s ago` : `${mag} ${prim} ago`;
}

module.exports = {
	makeFriendly,
	elapsedTime
};
