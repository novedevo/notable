import { Button, Card, Link, Typography } from "@mui/material";
import axios from "axios";
import { YouTubePlayer } from "react-youtube";
import { User } from "../types";

export function PdfNoteComponent(props: {
	note_id: number;
	notetaker_id?: number;
	note: string;
	time_stamp: number;
	page_number: number;
	onDelete?: () => void;
}) {
	const user: User = JSON.parse(localStorage.getItem("user")!);
	return (
		<Card>
			<Typography>{props.note}</Typography>
			<Typography>
				{new Date(Math.floor(props.time_stamp) * 1000)
					.toISOString()
					.substring(11, 19)}
			</Typography>
			<Typography>Page {props.page_number}</Typography>
			{props.notetaker_id === user.id && (
				<Button
					onClick={() => {
						deleteNote(props.note_id);
						if (props.onDelete) {
							props.onDelete();
						}
					}}
				>
					delete
				</Button>
			)}
		</Card>
	);
}

export function VideoNoteComponent(props: {
	player?: YouTubePlayer;
	note_id: number;
	notetaker_id?: number;
	note: string;
	time_stamp: number;
	onDelete?: () => void;
}) {
	const user: User = JSON.parse(localStorage.getItem("user")!);
	return (
		<Card>
			<Typography>{props.note}</Typography>
			<Typography>
				<Link
					onClick={() => props.player && props.player.seekTo(props.time_stamp)}
					style={{ cursor: "pointer" }}
				>
					{new Date(Math.floor(props.time_stamp) * 1000)
						.toISOString()
						.substring(11, 19)}
				</Link>
				{props.notetaker_id === user.id && (
					<Button
						onClick={() => {
							deleteNote(props.note_id);
							if (props.onDelete) {
								props.onDelete();
							}
						}}
					>
						Delete
					</Button>
				)}
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
