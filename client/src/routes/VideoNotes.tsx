import { Container, Link, Typography } from "@mui/material";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import InputNotes from "../components/InputNotes";
import Sidebar from "../components/Sidebar";
import { VideoNote } from "../types";
import axios from "axios";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function VideoNotes({
	url,
	inputNotes,
	presentationId,
}: {
	url: string;
	inputNotes: VideoNote[];
	presentationId: number;
}) {
	const videoId = parseId(url);

	const [notes, setNotes] = useState<VideoNote[]>(inputNotes);
	const [player, setPlayer] = useState<YouTubePlayer>(null);

	return (
		<div>
			<Sidebar />
			<Container>
				<div id="container">
					<div id="adjustableSize">
						<YouTube id="YoutubeVideo"
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
					</div>
						<div className="right-side">
							<Typography>Notes</Typography>
							<Container id="notes-display">
								{notes.map((note, i) => {
									return generateNote(note, player, i);
								})}
							</Container>
							<InputNotes
								post={
									(value) => {
										const time = player.getCurrentTime();
										setNotes([...notes, { note: value, time_stamp: time }]);
										client.post("/api/addNote", {
											note: value,
											timestamp: time,
											presentationId,
										});
									}
									//todo: add socket communication to update server notes
								}
							/>
						</div>
				</div>
			</Container>
		</div>
	);
}

function generateNote(note: VideoNote, player: YouTubePlayer, index: number) {
	return (
		<li key={index}>
			{note.note + "\t ".repeat(20)}
			<Link onClick={() => player.seekTo(note.time_stamp)}>
				{new Date(Math.floor(note.time_stamp) * 1000)
					.toISOString()
					.substring(11, 19)}
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

	if (match?.length === 11) {
		return match;
	} else {
		alert("invalid url");
	}
}
