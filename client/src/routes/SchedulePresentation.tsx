import { Button, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function SchedulePresentation() {
	const [title, setTitle] = useState("");
	const [scheduled_date, setscheduled_date] = useState(dayjs());
	const [youtube_url, setyoutube_url] = useState("");
	const [presentationId, setPresentationId] = useState("");
	const [pdf, setPdf] = useState<File | null>(null);
	const [presentationList, setPresentationList] = useState<any[]>([]);
	const [presenter_id, setpresenter_id] = useState("");
	const userJson = localStorage.getItem("user");

	let user: { name?: any };
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}

	// setting the id of the host
	useEffect(() => {
		getUserId().then((id) => {
			setpresenter_id(id);
		});
	}, []);

	useEffect(() => {
		console.log(presenter_id);
	}, [presenter_id]);

	/*

	// called everytime a new element is added to the presentationList array and adds the current array to local storage
	useEffect( () => {
	localStorage.setItem("localpresentationList", JSON.stringify(presentationList))
	}, [presentationList]);
	*/

	// returns a random string of numbers and letters
	/*
	const generateId = () => {
		return Math.random().toString(36);
	}

	// checks the randomly generated ID against the ones already in the array so there are no duplicates
	const uniqueId = () => {
		const tempId = generateId();
		presentationList.forEach(presentation => {
			if (tempId === presentation.presentationId) {
				uniqueId();
			}
		});
		setPresentationId(tempId);
	}
	*/

	const dateFormat = () => {
		// might need to format date in future
	};

	const postPresentation = () => {
		axios
			.post("/api/presentation", {
				title,
				scheduled_date,
				youtube_url,
				pdf,
				presenter_id,
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => alert("invalid presentation"));
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
					setyoutube_url(e.target.value);
				}}
				required
			/>
			<TextField
				label="Presentation Start Time"
				type="datetime-local"
				defaultValue={scheduled_date.format("YYYY-MM-DDTHH:mm")}
				onChange={(e) => {
					setscheduled_date(dayjs(e.target.value));
				}}
			/>
			<Button
				href=""
				variant="contained"
				onClick={postPresentation}
				id="generateId"
			>
				Save and Generate Code
			</Button>

			<div>Your Presentation Code: {presentationId}</div>
		</Container>
	);
}

async function getUserId() {
	try {
		const result = await axios("/api/user_id", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		return result.data.id;
	} catch (err) {
		console.log(err);
	}
}
