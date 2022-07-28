import { Button, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { Presentation } from "../types";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function PresentationEdit() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [scheduled_date, setscheduled_date] = useState(dayjs());
	const [youtube_url, setyoutube_url] = useState("");
	const [pdf, setPdf] = useState<File | null>(null);
	const [presentation, setPresentation] = useState<Presentation | null>(null);
	let { id } = useParams();
	const stringPresentationId = id?.toString() ?? "";

	useEffect(() => {
		if (!id) {
			alert("No presentation id provided");
			return;
		}
		getPresentationMetadata(parseInt(id)).then((presentation) => {
			setPresentation(presentation);
			setTitle(presentation.title);
			setscheduled_date(dayjs(presentation.scheduled_date));
			/*
			if (presentation.pdf != null) {
				setPdf(presentation.pdf);
			}
			*/
			if (presentation.youtube_url != null) {
				setyoutube_url(presentation.youtube_url);
			}
		});
	}, [id]);

	useEffect(() => {
		console.log(title);
	}, [title]);

	const updatePresentation = () => {
		const formData = new FormData();
		formData.append("presentation_instance_id", stringPresentationId);
		formData.append("title", title);
		formData.append(
			"scheduled_date",
			scheduled_date.format("YYYY-MM-DD HH:mm:ss")
		);
		formData.append("youtube_url", youtube_url);
		pdf && formData.append("pdf", pdf);
		client
			.put("/api/presentation", formData)
			.then((res) => {
				console.log(res.data);
				navigate("/presentations");
			})
			.catch((err) => alert("invalid presentation: " + err.message));
	};

	if (presentation === null) {
		return (
			<div>
				<Sidebar />
				<Container>
					<h1>Whoops! There's no presentation here!</h1>
				</Container>
			</div>
		);
	} else {
		return (
			<div id="containerIfSidebar">
				<div id="schedulepresentation">
					<div id="presentationheader"></div>
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
								style={{
									backgroundColor: "white",
								}}
								variant="outlined"
								id="title"
								label="Title"
								defaultValue={presentation.title}
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
								//defaultValue={presentation!.pdf}
								required
								onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
							/>
						</div>

						<div id="presentationlabel"> Enter a Video Link:</div>
						<div>
							<TextField
								style={{
									backgroundColor: "white",
								}}
								variant="outlined"
								id="video"
								label="Video"
								defaultValue={presentation!.youtube_url}
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
								style={{
									backgroundColor: "white",
								}}
								label="Presentation Start Time"
								type="datetime-local"
								defaultValue={dayjs(presentation.scheduled_date).format(
									"YYYY-MM-DDTHH:mm"
								)}
								onChange={(e) => {
									setscheduled_date(dayjs(e.target.value));
								}}
							/>
						</div>

						<div id="presentationlabel">
							<Button
								href=""
								variant="contained"
								onClick={updatePresentation}
								id="presentationbutton"
							>
								Save and Update Presentation
							</Button>
						</div>
					</div>
				</div>
				<div id="presentationsidebar"></div>

				<div id="presentationfooter"></div>
				<div id="presentationfooter"></div>
				<div id="presentationfooter"> notable™</div>
			</div>
		);
	}
}

async function getPresentationMetadata(id: number): Promise<Presentation> {
	const response = await client.get(`/api/presentation/${id}`);
	return response.data;
}
