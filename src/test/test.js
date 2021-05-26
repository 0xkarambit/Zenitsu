const log = console.log;

// what is the range of math.random ?
const d = [...Array(100).keys()]; // [0...99]

const map = [];

const getWidth = () => 4;
const getHeight = () => 10;

for (let i = 0; i < getHeight(); i++) {
	let row = [];
	for (let ii = 0; ii < getWidth(); ii++) {
		row.push({
			id: Math.floor(Math.random() * 10),
			row: i,
			col: ii
		});
	}
	map.push(row);
}

log(map);

let row = 0;
let col = 0;

let rLen = getHeight();
let cLen = getWidth();

log(map[row % rLen][col % cLen]);
