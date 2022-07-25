import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Presentation } from "../types";
import DashboardButton from "../components/DashboardButton";
import {Container} from "@mui/material";

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
		<Container>
			<div id= "background-image"></div>
			<DashboardButton />
			
			<div>
			<div id="pageHead"><h1>View Notes</h1></div>
				{presentations.length === 0 &&
				<div id="middlePanel">
					<h2><br></br><br></br><br></br><br></br>
					You have no notes
					<br></br><br></br></h2>
				<h5>Notes that you take in presentations will show up here!</h5>
				</div>
				}
			</div>
			<div id="noteSets_container">
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
		</Container>
	);
};
export default ViewNotes;
