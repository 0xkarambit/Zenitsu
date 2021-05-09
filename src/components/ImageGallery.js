import { useState } from "react";

// ok this seems harder than i thought.
const ImageGallery = ({ gallery }) => {
	// would gallery being passed down each time cause a re render and re allocation of [sources] ?
	// guess we will have to use useMemo.
	const [n, setN] = useState(0);
	// https://i.redd.it/<id goes here>.png | .jpg | get format too. CANT | so is it always jpg ????
	const sources = gallery.map(
		(img) => `https://i.redd.it/${img.media_id}.jpg`
	);

	// const currentImg = gallery[n];

	const change = (acc) => setN((n) => n + acc);

	// should we have multiple img tags or same img tag;
	// add blur ability too.
	return (
		<div className="gallery">
			{/*sources.map( url => <img src={url} alt=""/>)*/}
			<img
				height="400px"
				width="400px"
				style={{ objectFit: "contain" }}
				src={sources[n]}
				alt={`no ${n + 1}`}
				srcset=""
			/>
		</div>
	);
};

export default ImageGallery;
