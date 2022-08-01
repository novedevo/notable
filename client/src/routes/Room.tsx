import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Presentation, VideoNote, PdfNote, User } from "../types";
import VideoNotes from "./VideoNotes";
import PdfNotes from "./PdfNotes";
import PresenterView from "./PresenterView";
import Sidebar from "../components/Sidebar";
import "./AppExtras.css";
import { io, Socket } from "socket.io-client";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function Room() {
	const [presentation, setPresentation] = useState<Presentation | null>(null);
	const [socket, setSocket] = useState<Socket>();
	const user: User = JSON.parse(localStorage.getItem("user")!);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [navigate, user]);
	// being able to use presentations prop
	let { id } = useParams();
	useEffect(() => {
		if (!id) {
			alert("No presentation id provided");
			return;
		}
		getPresentationMetadata(parseInt(id)).then((presentation) => {
			if (presentation.youtube_url || presentation.pdf) {
				setPresentation(presentation);
			} else {
				console.error("No video or pdf found");
			}
		});
	}, [id]);

	useEffect((): any => {
		const socket = io();
		setSocket(socket);
		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.emit("join_room", {
			room: presentation?.presentation_instance_id,
			name: user?.username,
		});

		// CLEAN UP THE EFFECT
		return () => socket && socket.disconnect();
	}, [presentation?.presentation_instance_id, user?.username]);

	if (presentation === null || !socket || !user) {
		return (
			<div>
				<Sidebar />
				<div id="containerIfSidebar">
					<h1>Loading Notable...</h1>
				</div>
			</div>
		);
	} else if (user.id === presentation.presenter_id) {
		return (
			<div>
				<Sidebar />
				<PresenterView socket={socket} />
			</div>
		);
	} else if (presentation.youtube_url) {
		return (
			<div>
				<Sidebar />
				<div id="containerIfSidebar">
					<VideoNotes
						url={presentation.youtube_url!}
						inputNotes={presentation.notes as VideoNote[]}
						presentationId={presentation.presentation_instance_id}
						socket={socket}
					/>
				</div>
			</div>
		);
	} else {
		const pdf = `data:text/plain;base64,${presentation.pdf}`;
		return (
			<div>
				<Sidebar />
				<div id="containerIfSidebar">
					<PdfNotes
						pdf={pdf!}
						startTime={presentation.scheduled_date}
						inputNotes={presentation.notes as PdfNote[]}
						socket={socket}
					/>
				</div>
			</div>
		);
	}
}

async function getPresentationMetadata(id: number): Promise<Presentation> {
	const response = await client.get(`/api/presentation/${id}`);
	return response.data;
}
