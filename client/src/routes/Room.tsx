import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Presentation, VideoNote, PdfNote } from "../types";
import VideoNotes from "./VideoNotes";
import PdfNotes from "./PdfNotes";

export default function Room() {
	const [presentation, setPresentation] = useState<Presentation | null>(null);
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
			<Container>
				<h1>Loading...</h1>
			</Container>
		);
	} else if (presentation.youtube_url) {
		return (
			<VideoNotes
				url={presentation.youtube_url!}
				inputNotes={presentation.notes as VideoNote[]}
				presentationId={presentation.presentation_instance_id}
			/>
		);
	} else {
		const pdf = `data:text/plain;base64,${presentation.pdf}`;
		return (
			<PdfNotes
				pdf={pdf!}
				startTime={presentation.scheduled_date}
				inputNotes={presentation.notes as PdfNote[]}
			/>
		);
	}
}

async function getPresentationMetadata(id: number): Promise<Presentation> {
	const response = await axios.get(`/api/presentation/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
}
