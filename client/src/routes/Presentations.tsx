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
		<Container>
			<Button href="/schedulepresentation" variant="contained">
				Schedule Presentation
			</Button>
			<DashboardButton />
			<h1>Join a Presentation</h1>
			<h3>Your name for joining this session is {user.name}</h3>
			<TextField
				variant="outlined"
				id="PresentationID"
				label="Presentation ID"
				onChange={(event) => setPresentationID(parseInt(event.target.value))}
			/>
			<Button href="" variant="contained" onClick={joinRoom}>
				Join Presentation
			</Button>
			<Container id="displayPresentations">
				{userPresentations.map((presentation) => (
					<Card>
						<li>{presentation.title}</li>
						<li>Host ID: {presentation.presenter_id}</li>
						<li>Starts at: {presentation.scheduled_date}</li>
						<li>Join with code: {presentation.presentation_instance_id}</li>
					</Card>
				))}
			</Container>
		</Container>
	);
}

async function getPresentations(): Promise<Presentation[]> {
	try {
		const result = await client("/api/presentations");
		console.log(result.data.presentations);
		return result.data.presentations;
	} catch (err) {
		console.error("Error getting presentations");
		console.error(err);
		return [];
	}
}
