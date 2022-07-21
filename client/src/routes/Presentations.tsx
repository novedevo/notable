import { Button, Card, Container, TextField } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import DashboardButton from "../components/DashboardButton";
import { User, Presentation } from "../types";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

// creates the socket endpoint so that we can emit messages to the server
const socket = io();
socket.on("connect_error", (err) => {
	console.log(`connect_error due to ${err.message}`);
});

export default function Presentations() {
	const navigate = useNavigate();
	const user: User = JSON.parse(localStorage.getItem("user")!);
	const [presentationID, setPresentationID] = useState(0);
	const [dbPresentations, setDbPresentations] = useState<Presentation[]>([]);
	const [userPresentations, setUserPresentations] = useState<Presentation[]>(
		[]
	);

	// Database Presentations
	useEffect(() => {
		getPresentations().then((presentations) => {
			setDbPresentations(presentations);
			setUserPresentations(
				presentations.filter(
					(presentation) => presentation.presenter_id === user.id
				)
			);
		});
	}, [user.id]);

	const joinRoom = () => {
		// checks against the database of presentations if there is a valid presentation corresponding to the id
		const validCode = dbPresentations.some(
			(presentation) => presentation.presentation_instance_id === presentationID
		);
		if (validCode) {
			const userData = {
				room: presentationID,
				name: user.name,
			};
			// sends userData to the server so that a person can join a room
			socket.emit("join_room", userData);
			// sends the user to that room
			navigate("/room/" + presentationID);
		} else {
			alert("Not a valid room code");
		}
	};

	return (
		<div id="presentations">
			<div id="presentationheader">
				<DashboardButton />
			</div>
			<div id="presentationheader">
				<h3>Your name for joining presentations is {user.name}</h3>
				<Button
					href="/schedulepresentation"
					variant="contained"
					id="presentationbutton"
					sx={{
						":hover": {
							color: "white",
						},
					}}
				>
					Schedule Presentation
				</Button>
			</div>
			<div id="presentationheader"></div>
			<div id="presentationsidebar"></div>
			<div id="presentationjoin">
				<h3>Join a Presentation </h3>
				<TextField
					variant="outlined"
					id="PresentationID"
					label="Presentation ID"
					onChange={(event) => setPresentationID(parseInt(event.target.value))}
				/>
				<Button variant="contained" onClick={joinRoom} id="presentationbutton">
					Join Presentation
				</Button>
			</div>
			<div id="presentationsidebar"></div>
			<div id="presentationsidebar"></div>
			<div id="presentationlist">
				<Container id="big-presentation-box">
					{userPresentations.map((presentation) => (
						<Card id="small-presentation-box">
							<div id="presentation-title">{presentation.title}</div>
							<div>Host ID: {presentation.presenter_id}</div>
							<div>Starts at: {presentation.scheduled_date}</div>
							<div>Join with code: {presentation.presentation_instance_id}</div>
						</Card>
					))}
				</Container>
			</div>
			<div id="presentationsidebar"></div>

			<div id="presentationfooter"></div>
			<div id="presentationfooter"></div>
			<div id="presentationfooter"> notable™</div>
		</div>
	);
}

async function getPresentations(): Promise<Presentation[]> {
	try {
		const result = await client("/api/presentations");
		console.log(result.data);
		return result.data;
	} catch (err) {
		console.error("Error getting presentations");
		console.error(err);
		return [];
	}
}
