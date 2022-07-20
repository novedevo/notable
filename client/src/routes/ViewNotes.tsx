import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const ViewNotes = () => {
	const [notes, setNotes] = useState<any[]>([]);
	useEffect(() => {
		axios
			.get("/api/get_noteSet")
			.then((res) => {
				console.log(res);
				setNotes(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			<h1>View Notes</h1>
			<div id="noteSets_container">
				{notes.length === 0 && <h2>No Notes</h2>}
				{notes.map((note) => (
					<Button id="noteSet">
						<p>{note.title}</p>
					</Button>
				))}
			</div>
		</div>
	);
};
export default ViewNotes;
