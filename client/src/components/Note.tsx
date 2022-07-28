import { Button, Card, Link, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { YouTubePlayer } from "react-youtube";

export function PdfNoteComponent(props: {
	note_id: number;
	note: string;
	time_stamp: number;
	page_number: number;
}) {
	return (
		<Card>
			<Typography>{props.note}</Typography>
			<Typography>
				{dayjs.duration(props.time_stamp, "milliseconds").format("HH:mm:ss")}
			</Typography>
			<Typography>Page {props.page_number}</Typography>
			<Button value={props.note_id} onClick={() => deleteNote(props.note_id)}>
				delete
			</Button>
		</Card>
	);
}

export function VideoNoteComponent(props: {
	player?: YouTubePlayer;
	note_id: number;
	note: string;
	time_stamp: number;
}) {
	return (
		<Card>
			<Typography>{props.note}</Typography>
			<Typography>
				<Link
					onClick={() => props.player && props.player.seekTo(props.time_stamp)}
				>
					{new Date(Math.floor(props.time_stamp) * 1000)
						.toISOString()
						.substring(11, 19)}
				</Link>
				<Button value={props.note_id} onClick={() => deleteNote(props.note_id)}>
					delete
				</Button>
			</Typography>
		</Card>
	);
}

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

async function deleteNote(id: number) {
	await client
		.delete(`/api/note/${id}`)
		.catch((err) => console.log(err.message));
}
