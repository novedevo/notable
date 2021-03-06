import { Container, Link, Typography } from "@mui/material";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import InputNotes from "../components/InputNotes";
import DashboardButton from "../components/DashboardButton";
import { VideoNote } from "../types";
import axios from "axios";

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
		<Container>
			<DashboardButton />
			<div id="container">
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
							post={
								(value) => {
									const time = player.getCurrentTime();
									setNotes([...notes, { note: value, time_stamp: time }]);
									axios.post(
										"/api/addNote",
										{
											note: value,
											timestamp: time,
											presentationId,
										},
										{
											headers: {
												Authorization: `Bearer ${localStorage.getItem(
													"token"
												)}`,
											},
										}
									);
								}
								//todo: add socket communication to update server notes
							}
						/>
					</div>
				</Container>
			</div>
		</Container>
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
