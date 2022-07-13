import { Button, Container, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import PresentationRoom from "./PresentationRoom";

const ENDPOINT = "http://localhost:3001";

const socket = io(ENDPOINT);

socket.on("connect_error", (err: { message: any; }) => {
  console.log(`connect_error due to ${err.message}`);
});

export default function Presentations() {
	const navigate = useNavigate();
	const userJson = localStorage.getItem("user");
	let user: { name?: any; };
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}

	const [PresentationID, setPresentationID] = useState("");
	const [showPresentation, setShowPresentation] = useState(false);

	
	const joinPresentation = () => {
			const userData = {
				room: PresentationID,
				name: user.name,
			  };
		socket.emit("join_room", userData);
		setShowPresentation(true);
		
	}	

	return (
		<Container>
		{!showPresentation ? (
			<><h1>Join a Presentation</h1><h3>Your name for joining this session is {user.name}</h3>
				<TextField
					variant="outlined"
					id="PresentationID"
					label="Presentation ID"
					onChange={(event) => {
						setPresentationID(event.target.value);
					} }
				/>
				<Button href="" variant="contained" onClick={joinPresentation}>
				Join Presentation
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
