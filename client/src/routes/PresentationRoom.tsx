import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();
socket.on("connect_error", (err: { message: any }) => {
	console.log(`connect_error due to ${err.message}`);
});

function PresentationRoomTest() {
	let currentURL = window.location.href;
	const [userInfo, setUserInfo] = useState<string[]>([]);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	let presentationId = currentURL.split("room/")[1];

	getPresentations().then((presentations) => {
		presentations.forEach(
			(presentation: {
				scheduled_date: SetStateAction<string>;
				title: SetStateAction<string>;
				presentation_instance_id: SetStateAction<string>;
			}) => {
				if (presentationId == presentation.presentation_instance_id) {
					setTitle(presentation.title);
					setDate(presentation.scheduled_date);
				}
			}
		);
	});

	// Everytime a new user joins the room the socket is updated and this useEffect is called
	// it calls "get_users" in index.js and sends the presentationId of the room the user joined
	useEffect(() => {
		socket.emit("get_users", presentationId);
	}, []);

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
			<h1>Welcome to Presentation Room {title}</h1>
			<h2>The Presentation ID for this room is {presentationId}</h2>
			<h3>This Presentation is scheduled to start on {date}</h3>
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
		const result = await axios("/api/presentations");
		console.log(result.data.presentations);
		return result.data.presentations;
	} catch (err) {
		console.log(err);
	}
}

export default PresentationRoomTest;
