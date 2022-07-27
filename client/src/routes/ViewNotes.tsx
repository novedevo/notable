import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Presentation } from "../types";
import { Button, Container } from "@mui/material";
import Sidebar from "../components/Sidebar";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

const ViewNotes = () => {
	const [presentations, setPresentations] = useState<Presentation[]>([]);
	useEffect(() => {
		getPresentationWithNotes().then((notepresentations) => {
			setPresentations(notepresentations);
		});
	}, []);

	const deleteNote = (event: {
		currentTarget: {
			value: any;
		};
	}) => {
		console.log(event.currentTarget.value);
		client
			.delete(`/api/presentationNotes/${event.currentTarget.value}`)
			.then((res) => {
				alert("Presentation Note Deleted!");
				console.log(res.data);
			})
			.catch((err) => alert("invalid presentation: " + err.message));
	};

	return (
		<div data-testid="ViewNotes-component">
			<Sidebar />
			<Container>
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

async function getPresentationWithNotes(): Promise<Presentation[]> {
	const response = await client.get("/api/notePresentations/");
	return response.data;
}
export default ViewNotes;
