import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import DashboardButton from "../components/DashboardButton";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function SchedulePresentation() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [scheduled_date, setscheduled_date] = useState(dayjs());
	const [youtube_url, setyoutube_url] = useState("");
	const [pdf, setPdf] = useState<File | null>(null);
	const user: User = JSON.parse(localStorage.getItem("user")!);
	const stringId = "" + user.id;

	useEffect(() => {
		console.log(user.id);
	}, [user.id]);

	const postPresentation = () => {
		const formData = new FormData();
		formData.append("title", title);
		formData.append(
			"scheduled_date",
			scheduled_date.format("YYYY-MM-DD HH:mm:ss")
		);
		formData.append("youtube_url", youtube_url);
		pdf && formData.append("pdf", pdf);
		formData.append("presenter_id", stringId);
		axios
			.post("/api/presentation", formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				console.log(res.data);
				navigate("/presentations");
			})
			.catch((err) => alert("invalid presentation: " + err.message));
	};

	return (
		<div id="schedulepresentation">
			<div id="presentationheader">
				<DashboardButton />
			</div>
			<div id="presentationheader">
				<h3>Schedule Presentation</h3>
				<Button
					href="/presentations"
					variant="contained"
					id="presentationbutton"
					sx={{
						":hover": {
							color: "white",
						},
					}}
				>
					View Your Presentations
				</Button>
			</div>
			<div id="presentationheader"></div>
			<div id="presentationsidebar"></div>
			<div id="presentationcreate">
				<div id="presentationlabel">
					{" "}
					Enter a Presentation Title (required):
				</div>
				<div>
					<TextField
						variant="outlined"
						id="title"
						label="Title"
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						required
					/>
				</div>

				<div id="presentationlabel"> Enter a PDF file:</div>
				<div>
					<input
						type="file"
						id="uploadPDF"
						accept=".pdf,application/pdf"
						required
						onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
					/>
				</div>

				<div id="presentationlabel"> Enter a Video Link:</div>
				<div>
					<TextField
						variant="outlined"
						id="video"
						label="Video"
						onChange={(e) => {
							setyoutube_url(e.target.value);
						}}
					/>
				</div>

				<div id="presentationlabel">
					{" "}
					Enter the Start Time of the Presentation (required):
				</div>
				<div>
					<TextField
						label="Presentation Start Time"
						type="datetime-local"
						defaultValue={scheduled_date.format("YYYY-MM-DDTHH:mm")}
						onChange={(e) => {
							setscheduled_date(dayjs(e.target.value));
						}}
					/>
				</div>

				<div id="presentationlabel">
					<Button
						href=""
						variant="contained"
						onClick={postPresentation}
						id="presentationbutton"
					>
						Save and Generate Code
					</Button>
				</div>
			</div>
			<div id="presentationsidebar"></div>

			<div id="presentationfooter"></div>
			<div id="presentationfooter"></div>
			<div id="presentationfooter"> notable???</div>
		</div>
	);
}
