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
	let passed = (a - b) / 1000; // no of seconds passed
	//
	for (let i in "" + passed) {
		let u = passed[i];
	}
}

module.exports = {
	makeFriendly
};
