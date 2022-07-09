import { Button, Container } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	const [user, setUser] = useState({ name: "user", admin: false });
	const navigate = useNavigate();
	axios("/api/user").then((res) => {
		if (res.data.user) {
			setUser(res.data.user);
		} else {
			navigate("/login");
		}
	});
	return (
		<Container>
			<h1>Welcome, {user.name}!</h1>
			{user.admin && (
				<Button href="/console" variant="contained">
					Admin Console
				</Button>
			)}
			<LogoutButton />
			<Button href="/edit" variant="contained">
				Video Notes
			</Button>
			<Button href="/pdf" variant="contained">
				PDF Viewer
			</Button>
		</Container>
	);
}
