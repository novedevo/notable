import { Button, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Presentation, User } from "../types";
import PublicNotes from "../components/PublicNotes";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function PresenterView(props: { socket: Socket }) {
	const [pdf, setPdf] = useState<boolean>(false);
	const [userInfo, setUserInfo] = useState<User[]>([]);
	const [title, setTitle] = useState("");
	const presentationId = parseInt(window.location.href.split("room/")[1]);
	useEffect(() => {
		getPresentation(presentationId).then((presentation) => {
			if (!presentation) {
				alert("Invalid presentation ID");
			} else {
				setTitle(presentation.title ?? "Invalid presentation");
				if (presentation.pdf) {
					setPdf(true);
				}
			}
		});
	}, [presentationId]);

	useEffect(() => {
		props.socket.on("user_list", (data: User[]) => {
			setUserInfo(data);
		});
	}, [props.socket]);

	const navigate = useNavigate();

	const endPresentation = () => {
		client
			.post(`/api/endPresentation/${presentationId}`)
			.then((res) => {
				alert("Presentation has been ended");
				console.log(res.data);
				navigate("/");
			})
			.catch((err) => alert("invalid presentation: " + err.message));
		props.socket.emit("end_presentation", { id: presentationId });
	};

	return (
		<div id="containerIfSidebar">
			<Container>
				<h5>
					Viewing Presentation "{title}" | Room ID: {presentationId}
				</h5>
				{userInfo.length ? <h5>Viewers:</h5> : <h5>There are no viewers</h5>}
				<ul>
					{userInfo.map((user) => {
						return <li key={user.id}>{user.name}</li>;
					})}
				</ul>
				<Button
					variant="contained"
					onClick={endPresentation}
					style={{
						backgroundColor: "#1e2124",
						color: "white",
					}}
				>
					End Presentation
				</Button>
				<PublicNotes
					socket={props.socket}
					presentationId={presentationId}
					pdf={Boolean(pdf)}
				/>
			</Container>
		</div>
	);
}

async function getPresentation(
	presentationId: number
): Promise<Presentation | undefined> {
	try {
		const result = await client("/api/presentation/" + presentationId);
		return result.data;
	} catch (err) {
		alert("Failed to get presentations: " + err);
	}
}
