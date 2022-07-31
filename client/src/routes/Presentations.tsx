import { Button, Card, Container, TextField } from "@mui/material";
import axios from "axios";
import { useState, useEffect, useReducer } from "react";
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
	const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
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
	}, [user.id, reducerValue]);

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

	const deletePresentation = (name: string, id: number) => {
		if (dayjs().isBefore(name)) {
			if (
				window.confirm("Are you sure you want to delete this presentation?")
			) {
				client
					.delete(`/api/presentation/${id}`)
					.then((res) => {
						alert("Presentation Deleted!");
						console.log(res.data);
						navigate("/presentations");
						forceUpdate();
					})
					.catch((err) => alert("invalid presentation: " + err.message));
			}
		} else {
			alert("You cannot delete a presentation that has started");
		}
	};

	const editPresentation = (name: string, id: number) => {
		if (dayjs().isBefore(name)) {
			navigate("/edit/" + id);
		} else {
			alert("You cannot edit a presentation that has started");
		}
	};

	const joinOwnPresentation = (room: number) => {
		const userData = {
			room,
			name: user.name,
		};
		// sends userData to the server so that a person can join a room
		socket.emit("join_room", userData);
		// sends the user to that room
		navigate("/room/" + room);
	};
	return (
		<>
			<Sidebar />
			<div id="containerIfSidebar">
				<div id="presentations">
					<div id="presentationheader"></div>
					<div id="presentationheader">
						<h3>Your displayed name is: {user.name}</h3>
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
							style={{
								backgroundColor: "white",
								marginTop: "3%",
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
					<div id="presentationsidebar"></div>
					<div id="presentationsidebar"></div>
					<div id="presentationlist">
						<Container id="big-presentation-box">
							{userPresentations.map((presentation) => (
								<Card
									id="small-presentation-box"
									key={presentation.presentation_instance_id}
								>
									<div id="presentation-title">{presentation.title}</div>
									<div>Host ID: {presentation.presenter_id}</div>
									{presentation.youtube_url ? (
										<div></div>
									) : (
										<div>
											Starts at:{" "}
											{dayjs(presentation.scheduled_date).format(
												"ddd MMM DD YYYY H:mm"
											)}
										</div>
									)}
									<div>
										Join with code: {presentation.presentation_instance_id}
									</div>
									<Button
										id="deletebutton"
										onClick={() =>
											deletePresentation(
												presentation.scheduled_date,
												presentation.presentation_instance_id
											)
										}
									></Button>
									<Button
										id="editbutton"
										onClick={() =>
											editPresentation(
												presentation.scheduled_date,
												presentation.presentation_instance_id
											)
										}
									></Button>
									<Button
										id="joinbutton"
										onClick={() =>
											joinOwnPresentation(presentation.presentation_instance_id)
										}
									></Button>
								</Card>
							))}
						</Container>
					</div>
					<div id="presentationsidebar"></div>
					<div id="presentationfooter"></div>
					<div id="presentationfooter"></div>
					<div id="presentationfooter"></div>
				</div>
			</div>
		</>
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
