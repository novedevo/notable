import { Button, Container, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import DashboardButton from "../components/DashboardButton";

// creates the socket endpoint so that we can emit messages to the server
const ENDPOINT = "http://localhost:3001";
const socket = io(ENDPOINT);
socket.on("connect_error", (err: { message: any }) => {
	console.log(`connect_error due to ${err.message}`);
});

export default function Presentations() {
	const navigate = useNavigate();
	const userJson = localStorage.getItem("user");
	const [presentationID, setPresentationID] = useState("");
	const localPresentations = localStorage.getItem("localpresentationList");
	const [usersPresentations, setusersPresentations] = useState<any[]>([]);

	let presentations: any[] = [];
	try {
		presentations = JSON.parse(localPresentations!);
	} catch (err) {
		presentations = [];
	}

	let user: { name?: string };
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}

	// Section for testing outputs with console.log
	useEffect(() => {
		console.log("users Presentations:", usersPresentations);
		console.log("local presentations", presentations);
	}, [usersPresentations]);

	// checks against the localstorage of presentations if there is a valid presentation corresponding to the name
	const validPresentationId = () => {
		if (
			presentations.some(
				(presentation) => presentation.presentationId === presentationID
			)
		) {
			joinPresentation();
		} else {
			alert("Not a valid room code");
		}
	};

	// sends userData to the server so that a person can join a room and sends the user to that room
	const joinPresentation = () => {
		const userData = {
			room: presentationID,
			name: user.name,
		};
		socket.emit("join_room", userData);
		navigate("/room/" + presentationID);
	};

	// only display the users presentations
	useEffect(() => {
		setusersPresentations([
			...usersPresentations,
			...presentations.filter(
				(presentation) => user.name === presentation.presentationHost
			),
		]);
	}, []);

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
				{usersPresentations.map((presentation) => {
					return (
						<Container>
							<li>{presentation.title}</li>
							<li>Host: {presentation.presentationHost}</li>
							<li>Starts at: {presentation.date}</li>
							<li>Join with: {presentation.presentationId}</li>
						</Container>
					);
				})}
			</div>
		</Container>
	);
}
