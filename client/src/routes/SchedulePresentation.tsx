import { Button, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { forEach } from "lodash";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function SchedulePresentation() {
	const [title, setTitle] = useState("");
	const [date, setDate] = useState(dayjs());
	const [pdf, setPdf] = useState("");
	const [video, setVideo] = useState("");
	const [presentationId, setPresentationId] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [presentationList, setPresentationList] = useState<any[]>([]);

	useEffect( () => {
		let presentation = {
			title: title,
			date: date,
			pdf: pdf,
			video: video,
			presentationId: presentationId,
		};
		setPresentationList([...presentationList, presentation]);
		console.log(presentation);
	}, [presentationId])

	useEffect( () => localStorage.setItem("localpresentationList", JSON.stringify(presentationList)), [presentationList]);

	const generateId = () => {
		return Math.random().toString(36);
	}

	const uniqueId = () => {
		const tempId = generateId();
		presentationList.forEach(presentation => {
			if (tempId === presentation.presentationId) {
				uniqueId();
			}
		});
		setPresentationId(tempId);
	}

	return (
		<Container>
			<Button href="/presentations" variant="contained">
				View Presentations
			</Button>
			<h1>Schedule Presentation</h1>

            <TextField
				variant="outlined"
				id="title"
				label="Title"
				onChange={(e) => {
					setTitle(e.target.value);
				}}
				required
			/>
			<input
				type="file"
				id="uploadPDF"
				accept=".pdf,application/pdf"
				required
				onChange={(e) => setFile(e.target.files?.[0] ?? null)}
			/>
			<TextField
				variant="outlined"
				id="video"
				label="Video"
				onChange={(e) => {
					setVideo(e.target.value);
				}}
				required
			/>
			<TextField
				label="Presentation Start Time"
				type="datetime-local"
				defaultValue={date.format("YYYY-MM-DDTHH:mm")}
				onChange={(e) => {
					setDate(dayjs(e.target.value));
				}}
			/>
            <Button href="" variant="contained" onClick={uniqueId}>
				Save and Generate Code
			</Button>

            <div>Your Presentation Code: {presentationId}</div>
		</Container>
	);
}