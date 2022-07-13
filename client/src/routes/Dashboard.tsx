import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	const navigate = useNavigate();
	const userJson = localStorage.getItem("user");
	let user;
	try {
		user = JSON.parse(userJson!);
	} catch (err) {
		user = {};
	}
	if (!user.name) {
		navigate("/login");
	}

	return (
		<Container>
			<h1>Welcome, {user.name}!</h1>
			{user.isAdmin && (
				<Button onclick={() => navigate("/console")} variant="contained">
					Admin Console
				</Button>
			)}
			<LogoutButton />
			<Button onclick={() => navigate("/edit")} variant="contained">
				Video Notes
			</Button>
			<Button onclick={() => navigate("/pdf")} variant="contained">
				PDF Viewer
			</Button>
			<Button onclick={() => navigate("/presentations")} variant="contained">
				Presentations
			</Button>
		</Container>
	);
}
