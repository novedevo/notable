import { Button, Container, Link, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import InputNotes from "../components/InputNotes";
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

	const [notes, setNotes] = useState<string[]>([]);

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
					<Container>
						{notes.map((note) => post(note, myRef.current!))}
					</Container>
					<InputNotes post={(value) => setNotes([...notes, value])} />
				</div>
			</Container>
		</>
	);
}

function post(val: string, ref: Video) {
	const gotTime: number = ref.getTime();

	return (
		<p>
			{val + "\t ".repeat(20)}
			<Link onClick={() => ref.setTime(gotTime)}>
				{new Date(Math.floor(gotTime) * 1000).toISOString().substring(11, 19)}
			</Link>
		</p>
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
