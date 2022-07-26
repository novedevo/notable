import { Button, Container } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Presentation, User } from "../types";

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

	const navigate = useNavigate();

	const endPresentation = () => {
		const formData = new FormData();
		const currentURL = window.location.href;
		formData.append("presentation_instance_id", currentURL.split("room/")[1]);
		const id = JSON.parse(localStorage.getItem("user")!).id;
		formData.append("user_id", id);
		formData.append(
			"presentation_end_date",
			dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
		);
		axios
			.post("/api/updatepresentationend", formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				alert("Presentation has been ended");
				console.log(res.data);
				navigate("/");
			})
			.catch((err) => alert("invalid presentation: " + err.message));
	};

	return (
		<Container>
			<h1>Welcome to Presentation Room {title}</h1>
			<h2>The Presentation ID for this room is {presentationId}</h2>
			<Button variant="contained" onClick={endPresentation}>
				End Presenation
			</Button>
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
		return result.data;
	} catch (err) {
		console.log(err);
		return [];
	}
}

export default PresentationRoomTest;
