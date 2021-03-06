import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Presentation } from "../types";
import DashboardButton from "../components/DashboardButton";

const ViewNotes = () => {
	const [presentations, setPresentations] = useState<Presentation[]>([]);
	useEffect(() => {
		axios
			.get("/api/presentations", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
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
			<DashboardButton />
			<h1 className="header">View Notes</h1>
			<div id="noteSets_container">
				{presentations.length === 0 && <h2>No Presentations</h2>}
				{presentations.map((presentation) => (
					<Link
						to={`/room/${presentation.presentation_instance_id}`}
						id="noteSet"
					>
						<p>{presentation.title}</p>
						<p>{presentation.presentation_instance_id}</p>
					</Link>
				))}
			</div>
		</div>
	);
};
export default ViewNotes;
