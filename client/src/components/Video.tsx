import React from "react";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

export default class Video extends React.Component<
	{ videoId: string },
	{ player: YouTubePlayer }
> {
	constructor({ videoId }: { videoId: string }) {
		super({ videoId });
		this.state = {
			player: null as YouTubePlayer,
		};
	}
	render() {
		return (
			<YouTube
				videoId={this.props.videoId}
				opts={{
					height: 800,
					width: 1000,
					playerVars: {
						autoplay: 1,
						playsInline: 1,
					},
				}}
				onReady={(event) => this.setState({ player: event.target })}
			/>
		);
	}
	setTime(seconds: number) {
		if (this.state.player) {
			this.state.player.seekTo(seconds);
		} else {
			alert("Player not ready");
		}
	}
	getTime() {
		if (this.state.player) {
			return this.state.player.getCurrentTime();
		} else {
			alert("Player not ready");
		}
	}
}
