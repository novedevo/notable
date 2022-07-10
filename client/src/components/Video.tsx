import React, { useEffect } from "react";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

export default function Video({
	videoId,
	time,
}: {
	videoId: string;
	time: number;
}) {
	const [player, setPlayer] = useState<YouTubePlayer>(null);
	useEffect(() => {
		if (player) {
			player.seekTo(time);
			player.playVideo();
		}
	});
	useEffect(() => {
		player.g;
	});

	return (
		<YouTube
			videoId={videoId}
			opts={{
				height: 800,
				width: 1000,
				playerVars: {
					// autoplay: 1,
					playsInline: 1,
					modestBranding: 1,
					start: time,
				},
			}}
			onReady={(event) => setPlayer(event.target)}
		/>
	);
}
