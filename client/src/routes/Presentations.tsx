import { Button, Container, TextField } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import DashboardButton from "../components/DashboardButton";

// creates the socket endpoint so that we can emit messages to the server
const socket = io();
socket.on("connect_error", (err: { message: any }) => {
	console.log(`connect_error due to ${err.message}`);
});

export default function Presentations() {
	const navigate = useNavigate();
	const userJson = localStorage.getItem("user");
	const [presentationId, setPresentationID] = useState("");
	const [databasePresentations, setDatabasePresentations] = useState<any[]>([]);
	const [userPresentations, setuserPresentations] = useState<any[]>([]);
	const [presentationHost, setPresentationHost] = useState("");

	let user: { name?: any };
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}

	// setting the id of the host
	getUserId().then((id) => {
		setPresentationHost(id);
	});

	// Database Presentations
	useEffect(() => {
		getPresentations().then((presentations) => {
			setDatabasePresentations(presentations);
		});
	}, []);

	// checks against the localstorage of presentations if there is a valid presentation corresponding to the name
	const validPresentationId = () => {
		let validCode = false;
		databasePresentations.forEach((presentation) => {
			if (presentationId == presentation.presentation_instance_id) {
				validCode = true;
				joinPresentation();
			}
		});
		if (validCode === false) {
			alert("Not a valid room code");
		}
	};

	// sends userData to the server so that a person can join a room and sends the user to that room
	const joinPresentation = () => {
		const userData = {
			room: presentationId,
			name: user.name,
		};
		socket.emit("join_room", userData);
		navigate("/room/" + presentationId);
	};

	useEffect(() => {
		databasePresentations.forEach((presentation) => {
			if (presentationHost === presentation.presenter_id) {
				setuserPresentations((usersPresentations2) => [
					...usersPresentations2,
					presentation,
				]);
			}
		});
	}, [databasePresentations]);

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
				onChange={(event) => {
					setPresentationID(event.target.value);
				}}
			/>
			<Button href="" variant="contained" onClick={validPresentationId}>
				Join Presentation
			</Button>
			<div id="displayPresentations">
				{userPresentations.map((presentation) => (
					<Container>
						<li>{presentation.title}</li>
						<li>Host: {presentation.presenter_id}</li>
						<li>Starts at: {presentation.scheduled_date}</li>
						<li>Join with: {presentation.presentation_instance_id}</li>
					</Container>
				))}
			</div>
		</Container>
	);
}

async function getPresentations() {
	try {
		const result = await axios("/api/presentations");
		console.log(result.data.presentations);
		return result.data.presentations;
	} catch (err) {
		console.log(err);
	}
}

async function getUserId() {
	try {
		const result = await axios("/api/user_id", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		return result.data.id;
	} catch (err) {
		console.log(err);
	}
}
