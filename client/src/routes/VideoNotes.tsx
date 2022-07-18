import { Button, Container, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import InputNotes from "../components/InputNotes";
import DashboardButton from "../components/DashboardButton";

export default function VideoNotes() {
	const [videoUrl, setVideoUrl] = useState("LEENEFaVUzU"); //kurzgesagt default
	const [videoId, setVideoId] = useState(videoUrl);
	const loadVideo = () => {
		const id = parseId(videoUrl);
		if (id) {
			setVideoId(id);
		} else {
			alert("Invalid URL");
		}
	};

	const [notes, setNotes] = useState<[string, number][]>([]);
	const [player, setPlayer] = useState<YouTubePlayer>(null);

	return (
		<div id="container">
			<TextField
				variant="outlined"
				id="video-form"
				label="URL"
				onChange={(event) => setVideoUrl(event.target.value)}
			/>
			<Button onClick={loadVideo}>Load Video</Button>
			<DashboardButton />
			<Container>
				<YouTube
					videoId={videoId}
					opts={{
						height: 800,
						width: 1000,
						playerVars: {
							// autoplay: 1,
							playsInline: 1,
							modestBranding: 1,
						},
					}}
					onReady={(event) => setPlayer(event.target)}
				/>
				<div className="right-side">
					<Typography>Notes</Typography>
					<Container>
						{notes.map((note, i) => {
							return generateNote(note, player, i);
						})}
					</Container>
					<InputNotes
						post={(value) =>
							setNotes([...notes, [value, player.getCurrentTime()]])
						}
					/>
				</div>
			</Container>
		</div>
	);
}

function generateNote(
	[val, time]: [val: string, time: number],
	player: YouTubePlayer,
	index: number
) {
	return (
		<li key={index}>
			{val + "\t ".repeat(20)}
			<Link onClick={() => player.seekTo(time)}>
				{new Date(Math.floor(time) * 1000).toISOString().substring(11, 19)}
			</Link>
		</li>
	);
}

// Method, YT Parser. Not ours.
function parseId(url: string) {
	// Regular expression, all possible combinations before YT unique ID.
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

	// Comparison between arg and the regular expression
	const match = url.match(regExp)?.[2];

	// Return the video ID by itself.
	return match?.length === 11 ? match : null;
}
