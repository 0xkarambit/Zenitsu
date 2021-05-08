import React, { useState, useEffect, useRef, useCallback } from "react";

/*
EVENT TO WATCH

play, pause, seeking, seeked, volumeChange Waiting

onBUFFERING 
*/

const VideoPlayer = ({ videoUrl, audioUrl, poster }) => {
	const [autoPlay, setAutoPlay] = useState(true);
	const [shouldPreLoad, setShouldPreLoad] = useState(false);
	const videoPlayer = useRef();
	const audioPlayer = useRef();

	const play = useCallback(() => {
		videoPlayer.current.play().catch(console.log);
		audioPlayer.current.play().catch(console.log);
		// console.log({ paused: videoPlayer.paused });
		return Object.is(videoPlayer.paused, undefined) ? -1 : 0;
	}, []);

	const pause = () => {
		videoPlayer.current.pause();
		audioPlayer.current.pause();
	};

	// autoplay implmentation.
	useEffect(() => {
		if (!autoPlay) return null;
		audioPlayer.current.addEventListener("canplay", () => {
			videoPlayer.current.addEventListener("canplay", () => {
				// console.log(play());
				if (play() === -1) {
					// did not play most likely because of -> DOMException: play() failed because the user didn't interact with the document first
					// we need the muted property to play without user interaction
					// doesnt work because the audio doesnt play automatically.
					// this is good but lets just remove this autoplay tag can take care.
					videoPlayer.current.muted = true;
					play();
				}
			});
		});
	}, [autoPlay, play]);

	return (
		<>
			<video
				className="video-player"
				poster={poster}
				preload={shouldPreLoad}
				ref={videoPlayer}
				loop
				onPlay={play}
				onPause={pause}
				controls
				autoPlay={autoPlay}
			>
				<source src={videoUrl} type="" />
				your browser does not support video
			</video>
			<audio
				src={audioUrl}
				ref={audioPlayer}
				// style={{ display: "none" }}
				loop
			></audio>
		</>
	);
};

export default VideoPlayer;
