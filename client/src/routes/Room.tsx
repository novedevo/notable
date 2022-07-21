import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Presentation, VideoNote, PdfNote } from "../types";
import VideoNotes from "./VideoNotes";
import PdfNotes from "./PdfNotes";

export default function Room() {
	// being able to use presentations prop
	const state = useLocation().state as { presentation?: Presentation };
	const { id } = useParams();
	const [presentation, setPresentation] = useState<Presentation | null>(
		state?.presentation ?? null
	);

	useEffect(() => {
		if (!id) {
			return;
		}
		getPresentationMetadata(parseInt(id!)).then((presentation) => {
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
			/>
		);
	} else {
		return (
			<PdfNotes
				pdf={presentation.pdf!}
				startTime={presentation.scheduled_date}
				inputNotes={presentation.notes! as PdfNote[]}
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
