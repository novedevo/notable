import { Container, Typography } from "@mui/material";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import InputNotes from "../components/InputNotes";
import { VideoNote } from "../types";
import { VideoNoteComponent } from "../components/Note";
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
						{notes.map((note, i) => (
							<VideoNoteComponent
								{...note}
								key={note.note_id}
								player={player}
							/>
						))}
					</Container>
					<InputNotes
						post={
							async (value) => {
								const time = player.getCurrentTime();
								const result = await client.post("/api/addNote", {
									note: value,
									timestamp: parseInt(time),
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
								console.log(parseInt(time));
							}
							//todo: add socket communication to update server notes
						}
					/>
				</div>
			</div>
		</div>
	);
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
