import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Presentation, User } from "../types";
import DashboardButton from "../components/DashboardButton";
import { Button, Container } from "@mui/material";
import Sidebar from "../components/Sidebar";

const ViewNotes = () => {
	const [presentations, setPresentations] = useState<Presentation[]>([]);
	const user: User = JSON.parse(localStorage.getItem("user")!);
	const stringId = user.id.toString();
	useEffect(() => {
		getPresentationWithNotes(parseInt(stringId)).then((notepresentations) => {
			setPresentations(notepresentations);
		});
	}, []);

	const deleteNote = (event: {
		currentTarget: {
			value: any;
		};
	}) => {
		const formData = new FormData();
		console.log(event.currentTarget.value);
		console.log(stringId);
		formData.append("presentation_id", event.currentTarget.value);
		formData.append("notetaker_id", stringId);
		axios
			.post("/api/deletepresentationnotes", formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				alert("Presentation Note Deleted!");
				console.log(res.data);
			})
			.catch((err) => alert("invalid presentation: " + err.message));
	};

	return (
		<div>
			<Sidebar />
			<Container>
				<DashboardButton />
				<div id="background-image"></div>
				<div>
					<div id="pageHead">
						<h1>View Notes</h1>
					</div>
					{presentations.length === 0 && (
						<div id="middlePanelSmall">
							<h2>
								<br></br>
								You have no notes
								<br></br>
								<br></br>
							</h2>
							<h5>Notes that you take in presentations will show up here!</h5>
						</div>
					)}
				</div>
				<div id="noteSets_container">
					{presentations.map((presentation) => (
						<div>
							<Link
								to={`/room/${presentation.presentation_instance_id}`}
								id="noteSet"
							>
								<p>{presentation.title}</p>
								<p>{presentation.presentation_instance_id}</p>
							</Link>
							<Button
								id="deletebutton"
								value={presentation.presentation_instance_id}
								onClick={deleteNote}
							></Button>
						</div>
					))}
				</div>
			</Container>
		</div>
	);
};

async function getPresentationWithNotes(id: number): Promise<Presentation[]> {
	const response = await axios.get(`/api/notepresentations/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	return response.data;
}
export default ViewNotes;
