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
	const [pdf, setPdf] = useState<File | null>(null);
	const [presenter_id, setpresenter_id] = useState("");

	// setting the id of the host
	useEffect(() => {
		getUserId().then((id) => {
			setpresenter_id(id);
		});
	}, []);

	useEffect(() => {
		console.log(presenter_id);
	}, [presenter_id]);

	const postPresentation = () => {
		axios
			.post(
				"/api/presentation",
				{
					title,
					scheduled_date,
					youtube_url,
					pdf,
					presenter_id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			)
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
