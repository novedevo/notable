import { Container } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { io } from "socket.io-client";
import { Presentation, User } from "./Presentations";

const socket = io();
socket.on("connect_error", (err: { message: any }) => {
	console.log(`connect_error due to ${err.message}`);
});

function PresentationRoomTest() {
	let currentURL = window.location.href;
	const [userInfo, setUserInfo] = useState<string[]>([]);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const presentationId = parseInt(currentURL.split("room/")[1]);

	getPresentations().then((presentations) => {
		const presentation = presentations.find(
			(presentation) => presentation.presentation_instance_id === presentationId
		);
		if (presentation) {
			setTitle(presentation.title);
			setDate(presentation.scheduled_date);
		}
	});

	// Recieves the call when "user_list" is sent in index.js, it names the usernames of all the users
	// that have uniquely joined this room and adds it to an array locally
	socket.on("user_list", (data: User[]) => {
		setUserInfo(data.map((user) => user.name));
	});

	return (
		<Container>
			<h1>Welcome to Presentation Room {title}</h1>
			<h2>The Presentation ID for this room is {presentationId}</h2>
			<h3>This Presentation is scheduled to start on {date}</h3>
			{userInfo.length ? (
				<h3>The current users in this room are:</h3>
			) : (
				<h3>No users in this room</h3>
			)}
			<ul>
				{userInfo.map((user) => {
					return <li>{user}</li>;
				})}
			</ul>
		</Container>
	);
}

async function getPresentations(): Promise<Presentation[]> {
	try {
		const result = await axios("/api/presentations", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		return result.data.presentations;
	} catch (err) {
		console.log(err);
		return [];
	}
}

export default PresentationRoomTest;
