import { Button, Card, Container, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
			<Container>
				<div id="containerIfSidebar">
					<div id="adjustableSize">
						<YouTube
							id="YoutubeVideo"
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
								async (value) => {
									const time = player.getCurrentTime();
									const result = await client.post("/api/addNote", {
										note: value,
										timestamp: time,
										presentationId,
									});
									setNotes([
										...notes,
										{
											note: value,
											time_stamp: time,
											note_id: result.data[0].note_id,
										},
									]);
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
		<Card key={index}>
			<Typography>{note.note + "\t ".repeat(20)}</Typography>
			<Typography>
				<Link onClick={() => player.seekTo(note.time_stamp)}>
					{new Date(Math.floor(note.time_stamp) * 1000)
						.toISOString()
						.substring(11, 19)}
				</Link>
				<Button value={note.note_id} onClick={deleteNote}>
					delete
				</Button>
			</Typography>
		</Card>
	);
}

function deleteNote(event: {
	currentTarget: {
		value: any;
	};
}) {
	console.log("Note Deleted ", event.currentTarget.value);
	client
		.delete(`/api/note/${event.currentTarget.value}`)
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => alert("invalid note: " + err.message));
}

// Method, YT Parser. Very specific, just one way of doing this.
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
