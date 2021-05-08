import React, { useState, useEffect, useRef, useCallback } from "react";

/*
EVENT TO WATCH

play, pause, seeking, seeked, volumeChange Waiting

onBUFFERING 

audio has a durationchange Event
todo: find a way to figure out if its a direct load then mute the audio.
*/

const VideoPlayer = ({ videoUrl, audioUrl, poster }) => {
	const [autoPlay, setAutoPlay] = useState(true);
	const [shouldPreLoad, setShouldPreLoad] = useState(false);
	const videoPlayer = useRef();
	const audioPlayer = useRef();

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
				height="400px"
				width="600px"
				ref={videoPlayer}
				className="video-player"
				autoPlay={autoPlay}
				poster={poster}
				preload={shouldPreLoad}
				loop
				controls
				onPlay={play}
				onPause={pause}
				onWaiting={pause}
				onCanPlayThrough={play} // in response to onWaiting
				onStalled={pause}
				onSeeked={changeTimeStamp}
			>
				<source src={videoUrl} type="" />
				your browser does not support video
			</video>
			<audio src={audioUrl} ref={audioPlayer} loop></audio>
		</>
	);
};

export default VideoPlayer;
