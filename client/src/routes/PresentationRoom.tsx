import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();
socket.on("connect_error", (err: { message: any }) => {
	console.log(`connect_error due to ${err.message}`);
});

function PresentationRoomTest() {
	let currentURL = window.location.href;
	const [userInfo, setUserInfo] = useState<string[]>([]);
	const [databasePresentations, setDatabasePresentations] = useState<any[]>([]);

	useEffect(() => {
		getPresentations().then((presentation) => {
			setDatabasePresentations(presentation);
		});
	}, []);

	// gets the Presentation ID from the url and finds the corresponding presentation in the database
	const presentationId = currentURL.split("room/")[1];
	const currentPresentation = databasePresentations.find(
		(presentation) => presentation.presentation_instance_id === presentationId
	);

	if (!currentPresentation) {
		return <div>Loading...</div>;
	}

	// Recieves the call when "user_list" is sent in index.js, it names the usernames of all the users
	// that have uniquely joined this room and adds it to an array locally
	socket.on("user_list", (data: any) => {
		data.forEach((element: { name: string }) => {
			if (userInfo.indexOf(element.name) === -1) {
				setUserInfo([...userInfo, element.name]);
			}
		});
	});

	return (
		<div>
			<h1>Welcome to Presentation Room {currentPresentation.title}</h1>
			<h2>
				The Presentation ID for this room is{" "}
				{currentPresentation.presentation_instance_id}
			</h2>
			<h3>
				This Presentation is scheduled to start on{" "}
				{currentPresentation.scheduled_date}
			</h3>
			<div>
				{userInfo.map((user) => {
					return <li>{user}</li>;
				})}
			</div>
		</div>
	);
}

async function getPresentations() {
	try {
		const result = await axios("/api/presentations", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		console.log(result.data.presentations);
		return result.data.presentations;
	} catch (err) {
		console.log(err);
	}
}

export default PresentationRoomTest;
