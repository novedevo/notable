import { Button, Card, Container, TextField } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { User, Presentation } from "../types";
import dayjs from "dayjs";
import Sidebar from "../components/Sidebar";

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

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	});

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

	const deletePresentation = (event: {
		currentTarget: {
			name: any;
			value: any;
		};
	}) => {
		if (dayjs().isBefore(event.currentTarget.name)) {
			client
				.delete(`/api/presentation/${event.currentTarget.value}`)
				.then((res) => {
					alert("Presentation Deleted!");
					console.log(res.data);
					navigate("/presentations");
				})
				.catch((err) => alert("invalid presentation: " + err.message));
		} else {
			alert("You cannot delete a presentation that has started");
		}
	};

	const dateFormat = (date: any) => {
		let d = dayjs(date);
		return d.format("ddd MMM DD YYYY H:mm");
	};

	const editPresentation = (event: {
		currentTarget: {
			name: any;
			value: any;
		};
	}) => {
		if (dayjs().isBefore(event.currentTarget.name)) {
			navigate("/edit/" + event.currentTarget.value);
		} else {
			alert("You cannot edit a presentation that has started");
		}
	};

	const joinPresentation = (event: {
		currentTarget: {
			value: any;
		};
	}) => {
		const userData = {
			room: event.currentTarget.value,
			name: user.name,
		};
		// sends userData to the server so that a person can join a room
		socket.emit("join_room", userData);
		// sends the user to that room
		navigate("/room/" + event.currentTarget.value);
	};

	return (
		<div>
			<Sidebar />
			<div id="presentations">
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
				<div id="presentationjoin">
					<h3>Join a Presentation </h3>
					<TextField
						style={{
							backgroundColor: "white",
						}}
						variant="outlined"
						id="PresentationID"
						label="Presentation ID"
						onChange={(event) =>
							setPresentationID(parseInt(event.target.value))
						}
					/>
					<Button
						variant="contained"
						onClick={joinRoom}
						id="presentationbutton"
					>
						Join Presentation
					</Button>
				</div>
				<div id="presentationlist">
					<Container id="big-presentation-box">
						{userPresentations
							.sort((a, b) =>
								dayjs(a.scheduled_date).isAfter(dayjs(b.scheduled_date))
									? 1
									: -1
							)
							.map((presentation) => (
								<Card
									id="small-presentation-box"
									key={presentation.presentation_instance_id}
								>
									<div id="presentation-title">{presentation.title}</div>
									<div>Host ID: {presentation.presenter_id}</div>
									<div>
										Starts at: {dateFormat(presentation.scheduled_date)}
									</div>
									<div>
										Join with code: {presentation.presentation_instance_id}
									</div>
									<Button
										id="deletebutton"
										name={presentation.scheduled_date}
										value={presentation.presentation_instance_id}
										onClick={deletePresentation}
									></Button>
									<Button
										id="editbutton"
										name={presentation.scheduled_date}
										value={presentation.presentation_instance_id}
										onClick={editPresentation}
									></Button>
									<Button
										id="joinbutton"
										value={presentation.presentation_instance_id}
										onClick={joinPresentation}
									></Button>
								</Card>
							))}
					</Container>
				</div>
			</div>
		</div>
	);
}

async function getPresentations(): Promise<Presentation[]> {
	try {
		const result = await client("/api/currentPresentations");
		console.log(result.data);
		return result.data;
	} catch (err) {
		console.error("Error getting presentations");
		console.error(err);
		return [];
	}
}
