import { Button, Container, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import InputNotes from "../components/InputNotes";
import NotesDisplay from "../components/NotesDisplay";
import Video from "../components/Video";

export default function VideoNotes() {
	const [videoUrl, setVideoUrl] = useState("LEENEFaVUzU");
	const [videoId, setVideoId] = useState(videoUrl);
	const myRef = React.createRef<Video>();
	const loadVideo = () => {
		const id = parseId(videoUrl);
		if (id) {
			setVideoId(id);
		} else {
			alert("Invalid URL");
		}
	};

	return (
		<>
			<TextField
				variant="outlined"
				id="video-form"
				label="URL"
				onChange={(event) => setVideoUrl(event.target.value)}
			/>
			<Button onClick={loadVideo}>Load Video</Button>
			<Container>
				<Video videoId={videoId} ref={myRef} />
				<div className="right-side">
					<Typography>Notes</Typography>
					<NotesDisplay />
					<InputNotes />
				</div>
			</Container>
		</>
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
