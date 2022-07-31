import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState, useReducer } from "react";
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
	const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		getPresentationWithNotes().then((notepresentations) => {
			setPresentations(notepresentations);
		});
	}, [reducerValue]);

	const deleteNote = (event: {
		currentTarget: {
			value: any;
		};
	}) => {
		var confirmed = window.confirm(
			"Are you sure you want to delete this note?"
		);

		if (confirmed == true) {
			console.log(event.currentTarget.value);
			client
				.delete(`/api/presentationNotes/${event.currentTarget.value}`)
				.then((res) => {
					alert("Presentation Note Deleted!");
					console.log(res.data);
					forceUpdate();
				})
				.catch((err) => alert("invalid presentation: " + err.message));
		}
	};

	return (
		<div>
			<Sidebar />
			<div id="containerIfSidebar">
				<Container>
					<div id="viewNotesWithBacking"></div>
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
		</div>
	);
};

async function getPresentationWithNotes(): Promise<Presentation[]> {
	const response = await client.get("/api/notePresentations/");
	return response.data;
}
export default ViewNotes;
