import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const navigate = useNavigate();
	if (!user.name) {
		navigate("/login");
	}

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
