import axios from "axios";
import { useEffect, useState } from "react";

const ViewNotes = () => {
	const [notes, setNotes] = useState<any[]>([]);
	useEffect(() => {
		fetchNotes();
	}, []);

	const fetchNotes = () => {
		axios
			.get("/api/get_noteSet")
			.then((res) => {
				console.log(res);
				setNotes(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			<h1>View Notes</h1>
			<div id="noteSets_container">
				{notes.length === 0 && <h2>No Notes</h2>}
				{notes.map((note) => (
					<a id="noteSet" href="javascript:0">
						<p>{note.title}</p>
					</a>
				))}
			</div>
		</div>
	);
};
export default ViewNotes;
