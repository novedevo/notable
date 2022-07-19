import { Button, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function SchedulePresentation() {
	const [title, setTitle] = useState("");
	const [date, setDate] = useState(dayjs());
	const [video, setVideo] = useState("");
	const [presentationId, setPresentationId] = useState("");
	const [pdf, setPdf] = useState<File | null>(null);
	const [presentationList, setPresentationList] = useState<any[]>([]);
	const userJson = localStorage.getItem("user");

	let user: { name?: any };
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}

	// Called everytime a new PresentationId is set and adds all the user inputed info about a presentation to a array
	useEffect(() => {
		let presentation = {
			title: title,
			date: date,
			pdf: pdf,
			video: video,
			presentationId: presentationId,
			presentationHost: user.name,
		};
		console.log(presentation);
		setPresentationList([...presentationList, presentation]);
	}, [presentationId]);

	// called everytime a new element is added to the presentationList array and adds the current array to local storage
	useEffect(() => {
		localStorage.setItem(
			"localpresentationList",
			JSON.stringify(presentationList)
		);
	}, [presentationList]);

	// returns a random string of numbers and letters
	const generateId = () => {
		return Math.random().toString(36);
	};

	// checks the randomly generated ID against the ones already in the array so there are no duplicates
	const uniqueId = () => {
		const tempId = generateId();
		const isDuplicate = presentationList.some(
			(presentation) => tempId === presentation.presentationId
		);
		if (isDuplicate) {
			uniqueId();
		} else {
			setPresentationId(tempId);
		}
	};

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
				onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
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
			<Button href="" variant="contained" onClick={uniqueId} id="generateId">
				Save and Generate Code
			</Button>

			<div>Your Presentation Code: {presentationId}</div>
		</Container>
	);
}
