
function parse(body_html) {
	// nope we need something better
	let map = {
		"&amp;": "&",
		"&quot;": '"',
		"&apos;": "'",
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
	return { __html: parsed.replaceAll("&lt;", "<").replaceAll("&#39;", "'") };
}

// wow https://stackoverflow.com/questions/5796718/html-entity-decode
function convertHTMLEntity(text) {
	// not sure about performace
	const span = document.createElement("span");

	let parsed = text.replace(/&[#A-Za-z0-9]+;/gi, (entity, position, text) => {
		span.innerHTML = entity;
		return span.innerText;
	});
	return { __html: parsed };
}

module.exports = {
	convertHTMLEntity
}