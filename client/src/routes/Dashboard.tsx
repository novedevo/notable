import { Button, Container } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	const user = JSON.parse(localStorage.getItem("user")!);

	return (
		<Container>
			<h1>Welcome, {user.name}!</h1>
			{user.isAdmin && (
				<Button href="/console" variant="contained">
					Admin Console
				</Button>
			)}
			<LogoutButton />
			<Button href="/presentations" variant="contained">
				Presentations
			</Button>
			<Button href="/view" variant="contained">
				My Notes
			</Button>
		</Container>
	);
}
