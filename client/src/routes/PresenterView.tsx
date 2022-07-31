import { Button, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Note, PdfNote, Presentation, User, VideoNote } from "../types";
import { PdfNoteComponent, VideoNoteComponent } from "../components/Note";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

const socket = io();
socket.on("connect_error", (err: { message: any }) => {
	console.log(`connect_error due to ${err.message}`);
});

export default function PresenterView() {
	const [pdf, setPdf] = useState<boolean>(false);
	const [userInfo, setUserInfo] = useState<User[]>([]);
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState("");
	const presentationId = parseInt(window.location.href.split("room/")[1]);
	useEffect(() => {
		getPresentation(presentationId).then((presentation) => {
			if (!presentation) {
				alert("Invalid presentation ID");
			} else {
				setTitle(presentation.title ?? "Invalid presentation");
				setNotes(presentation.notes!);
				if (presentation.pdf) {
					setPdf(true);
				}
			}
		});
	}, [presentationId]);

	const navigate = useNavigate();

	// Receives the call when "user_list" is sent in index.js, it names the usernames of all the users
	// that have uniquely joined this room and adds it to an array locally
	socket.on("user_list", (data: User[]) => {
		setUserInfo(data);
	});
	socket.on("note_list", (data: Note[]) => {
		setNotes(data);
	});

	const endPresentation = () => {
		client
			.post(`/api/endPresentation/${presentationId}`)
			.then((res) => {
				alert("Presentation has been ended");
				console.log(res.data);
				navigate("/");
			})
			.catch((err) => alert("invalid presentation: " + err.message));
	};

	return (
		<div id="containerIfSidebar">
			<Container>
				<h5>
					Viewing Presentation "{title}" | Room ID: {presentationId}
				</h5>
				{userInfo.length ? <h5>Viewers:</h5> : <h5>There are no viewers</h5>}
				<ul>
					{userInfo.map((user) => {
						return <li key={user.id}>{user.name}</li>;
					})}
				</ul>
				<Button
					variant="contained"
					onClick={endPresentation}
					style={{
						backgroundColor: "#1e2124",
						color: "white",
					}}
				>
					End Presentation
				</Button>
				<h3>All notes taken for this presentation:</h3>
				<ul>
					{notes.map((note) =>
						pdf ? (
							<PdfNoteComponent {...(note as PdfNote)} key={note.note_id} />
						) : (
							<VideoNoteComponent {...(note as VideoNote)} key={note.note_id} />
						)
					)}
				</ul>
			</Container>
		</div>
	);
}

async function getPresentation(
	presentationId: number
): Promise<Presentation | undefined> {
	try {
		const result = await client("/api/presentation/" + presentationId);
		return result.data;
	} catch (err) {
		alert("Failed to get presentations: " + err);
	}
}
