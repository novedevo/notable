import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Presentation, VideoNote, PdfNote, User } from "../types";
import VideoNotes from "./VideoNotes";
import PdfNotes from "./PdfNotes";
import PresenterView from "./PresenterView";
import Sidebar from "../components/Sidebar";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function Room() {
	const [presentation, setPresentation] = useState<Presentation | null>(null);
	const user: User = JSON.parse(localStorage.getItem("user")!);
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

	if (presentation === null) {
		return (
			<div>
				<Sidebar/>
				<Container>
					<h1>Loading...</h1>
				</Container>
			</div>
		);
	} else if (presentation.youtube_url) {
		return (
			<div>
				<Sidebar/>
				{user.id === presentation.presenter_id ? (
					<PresenterView></PresenterView>
				) : (
					<div>Welcome Viewer</div>
				)}
				<VideoNotes
					url={presentation.youtube_url!}
					inputNotes={presentation.notes as VideoNote[]}
					presentationId={presentation.presentation_instance_id}
				/>
			</div>
		);
	} else {
		const pdf = `data:text/plain;base64,${presentation.pdf}`;
		return (
			<div>
				<Sidebar/>
				{user.id === presentation.presenter_id ? (
					<PresenterView></PresenterView>
				) : (
					<div>Welcome Viewer</div>
				)}
				<PdfNotes
					pdf={pdf!}
					startTime={presentation.scheduled_date}
					inputNotes={presentation.notes as PdfNote[]}
				/>
			</div>
		);
	}
}

async function getPresentationMetadata(id: number): Promise<Presentation> {
	const response = await client.get(`/api/presentation/${id}`);
	return response.data;
}
