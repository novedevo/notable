import { Button, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Note, PdfNote, Presentation, User } from "../types";
import { PdfNoteComponent, VideoNoteComponent } from "../components/Note";
import PublicNotes from "../components/PublicNotes";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function PresenterView(props: { socket: Socket }) {
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
				if (presentation.pdf) {
					setPdf(true);
				}
			}
		});
		getNotes(presentationId).then(setNotes);
	}, [presentationId]);

	useEffect(() => {
		props.socket.on("user_list", (data: User[]) => {
			setUserInfo(data);
		});
		props.socket.on("note_list", (data: Note[]) => {
			setNotes(data);
		});
		//
	}, [props.socket]);

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
		props.socket.emit("end_presentation", { id: presentationId });
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
				<PublicNotes
					socket={props.socket}
					presentationId={presentationId}
					pdf={Boolean(pdf)}
					notes={notes}
				/>
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
async function getNotes(presentationId: number): Promise<Note[]> {
	try {
		const result = await client("/api/publicNotes/" + presentationId);
		return result.data;
	} catch (err) {
		alert("Failed to get notes: " + err);
		return [];
	}
}
