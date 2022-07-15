import { Button, Container, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import DashboardButton from "../components/DashboardButton";
import PresentationRoom from "./PresentationRoom";

// creates the socket endpoint so that we can emit messages to the server
const ENDPOINT = "http://localhost:3001";
const socket = io(ENDPOINT);
socket.on("connect_error", (err: { message: any; }) => {
  console.log(`connect_error due to ${err.message}`);
});

export default function Presentations() {
	const navigate = useNavigate();
	const userJson = localStorage.getItem("user");
	const [PresentationID, setPresentationID] = useState("");
	const [showPresentation, setShowPresentation] = useState(false);
	const localPresentations = localStorage.getItem("localpresentationList");
	let presentations: any[] = [];
	try {
		presentations = JSON.parse(localPresentations!);
	} catch (err) {
		presentations = [];
	}

	let user: { name?: any; };
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}

	useEffect(() => {
		console.log(presentations);
	});

	// checks against the localstorage of presentations if there is a valid presentation corresponding to the name
	const validPresentationId = () => {
		let validCode = false;
		presentations.forEach(presentation => {
			if (PresentationID === presentation.presentationId) {
				validCode = true;
				//joinPresentation();
				testJoinPresentation();
			}
		});
		if (validCode === false) {
		alert("Not a valid room code");
		}
	}

	// sends userData to the server so that a person can join a room
	const joinPresentation = () => {
			const userData = {
				room: PresentationID,
				name: user.name,
			  };
		socket.emit("join_room", userData);
		setShowPresentation(true);	
	}	

	// sends userData to the server so that a person can join a room but this one navigates to a new page
	const testJoinPresentation = () => {
		const userData = {
			room: PresentationID,
			name: user.name,
		  };
	socket.emit("join_room", userData);
	navigate("/room/" + PresentationID);
	}

	return (
		<Container>
		{!showPresentation ? (
			<><Button href="/schedulepresentation" variant="contained">
			Schedule Presentation
			</Button>
			<DashboardButton />
			<h1>Join a Presentation</h1><h3>Your name for joining this session is {user.name}</h3>
				<TextField
					variant="outlined"
					id="PresentationID"
					label="Presentation ID"
					onChange={(event) => {
						setPresentationID(event.target.value);
					} }
				/>
				<Button href="" variant="contained" onClick={validPresentationId}>
				Join Presentation
				</Button>
				<Button href={'/room/' + PresentationID} variant="contained">
				Join Diff Presentation
				</Button>
				
				</>
		) 
	: (
		<div>
		<h1>Hello Member {user.name}</h1>
			<div>
			<PresentationRoom socket={socket} username={user.name} room={PresentationID} />
			</div>
		</div>
	 )}
		</Container>
	);
}
