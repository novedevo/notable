import { Button, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Note, PdfNote, Presentation, User, VideoNote } from "../types";
import Sidebar from "../components/Sidebar";
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
	const [userInfo, setUserInfo] = useState<string[]>([]);
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState("");
	const presentationId = parseInt(window.location.href.split("room/")[1]);
	useEffect(() => {
		getPresentations().then((presentations) => {
			const presentation = presentations.find(
				(presentation) =>
					presentation.presentation_instance_id === presentationId
			);
			if (!presentation) {
				alert("Invalid presentation ID");
			}
			setTitle(presentation?.title ?? "Invalid presentation");
			if (presentation?.pdf) {
				setPdf(true);
			}
		});
	}, [presentationId]);

	// Receives the call when "user_list" is sent in index.js, it names the usernames of all the users
	// that have uniquely joined this room and adds it to an array locally
	socket.on("user_list", (data: User[]) => {
		setUserInfo(data.map((user) => user.name));
	});
	socket.on("note_list", (data: Note[]) => {
		setNotes(data);
	});

	const navigate = useNavigate();

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
			<Sidebar />
			<Container>
				<h1>Welcome to Presentation Room {title}</h1>
				<h2>The Presentation ID for this room is {presentationId}</h2>
				<Button variant="contained" onClick={endPresentation}>
					End Presenation
				</Button>
				{userInfo.length ? (
					<h3>The current users in this room are:</h3>
				) : (
					<h3>No users in this room</h3>
				)}
				<ul>
					{userInfo.map((user) => {
						return <li>{user}</li>;
					})}
				</ul>
				<h3>All notes taken for this presentation:</h3>
				<ul>
					{notes.map((note) =>
						pdf ? (
							<PdfNoteComponent {...(note as PdfNote)} />
						) : (
							<VideoNoteComponent {...(note as VideoNote)} />
						)
					)}
				</ul>
			</Container>
		</div>
	);
}

async function getPresentations(): Promise<Presentation[]> {
	try {
		const result = await client("/api/presentations");
		return result.data;
	} catch (err) {
		alert("Failed to get presentations: " + err);
		return [];
	}
}
