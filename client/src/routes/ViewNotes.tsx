import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ViewNotes = () => {
	const [presentations, setPresentations] = useState<any[]>([]);
	useEffect(() => {
		axios
			.get("/api/get_presentations")
			.then((res) => {
				console.log(res);
				setPresentations(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			<h1>View Notes</h1>
			<div id="noteSets_container">
				{presentations.map((presentation) => (
					<Link to="/edit" state={{ notes: "notes" }} id="noteSet">
						<p>{presentation.title}</p>
						<p>{presentation.note}</p>
					</Link>
				))}
			</div>
		</div>
	);
};
export default ViewNotes;
