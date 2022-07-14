import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";

export default function SchedulePresentation() {
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [pdf, setPdf] = useState("");
	const [video, setVideo] = useState("");
	const [presentationId, setPresentationId] = useState("");
	const [presentationList, setPresentationList] = useState<any[]>([]);

	const generatePresentation = () => {
		let presentation = {
			title: title,
			date: date,
			pdf: pdf,
			video: video,
			presentationId: presentationId,
		};
		setPresentationList([...presentationList, presentation]);
		console.log(presentation);
	}

	return (
		<Container>
			<h1>Schedule Presentation</h1>

            <TextField
				variant="outlined"
				id="title"
				label="Title"
				onChange={(event) => {
					setTitle(event.target.value);
				}}
				required
			/>
			<TextField
				variant="outlined"
				id="video"
				label="Video"
				onChange={(event) => {
					setVideo(event.target.value);
				}}
				required
			/>
			<TextField
				variant="outlined"
				id="date"
				label="Date"
				onChange={(event) => {
					setDate(event.target.value);
				}}
				required
			/>
            
            <Button href="" variant="contained" onClick={generatePresentation}>
				Save and Generate Code
			</Button>

            <div>Your Presentation Code: </div>
		</Container>
	);
}