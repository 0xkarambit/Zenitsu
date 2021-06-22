import React, { useState, useEffect, useRef, useCallback } from "react";

/*
EVENT TO WATCH

play, pause, seeking, seeked, volumeChange Waiting

onBUFFERING 

audio has a durationchange Event
todo: find a way to figure out if its a direct load then mute the audio.
*/

const VideoPlayer = ({
	videoUrl,
	audioUrl,
	poster,
	width,
	height,
	is_gif,
	muted
}) => {
	const [autoPlay, setAutoPlay] = useState(true);
	const [shouldPreLoad, setShouldPreLoad] = useState(false);
	const videoPlayer = useRef();
	const audioPlayer = useRef();

	const [clicked, setClicked] = useState(false);

	const play = () => {
		videoPlayer.current.play().catch(console.log);
		audioPlayer.current.play().catch(console.log);
	};

	const pause = () => {
		videoPlayer.current.pause();
		audioPlayer.current.pause();
	};

	const deb = (e) => {
		console.log(e);
	};

	const changeTimeStamp = (e) => {
		let t = e.target.currentTime;
		audioPlayer.current.currentTime = t;
	};

	return (
		<>
			<video
				// height={height}
				// width={width}
				ref={videoPlayer}
				className="video-player"
				autoPlay={autoPlay}
				poster={poster}
				preload={shouldPreLoad}
				loop={is_gif}
				controls
				onPlay={play}
				onPause={pause}
				onWaiting={pause}
				onCanPlayThrough={play} // in response to onWaiting
				onStalled={pause} // ! maybe this is the one ? idk
				onSeeked={changeTimeStamp}
			>
				<source src={videoUrl} type="" />
				your browser does not support video
			</video>
			<audio
				src={audioUrl}
				ref={audioPlayer}
				loop
				// doesnt work as of now.
			// autoPlay={!muted}
			></audio>
		</>
	);
};

export default VideoPlayer;
