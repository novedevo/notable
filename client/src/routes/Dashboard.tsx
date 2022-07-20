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
			<Button
				href="/video"
				variant="contained"
				sx={{
					":hover": {
						color: "white",
					},
				}}
			>
				Video Notes
			</Button>
			<Button
				href="/pdf"
				variant="contained"
				sx={{
					":hover": {
						color: "white",
					},
				}}
			>
				PDF Viewer
			</Button>
			<Button
				href="/presentations"
				variant="contained"
				sx={{
					":hover": {
						color: "white",
					},
				}}
			>
				Presentations
			</Button>
			<Button
				href="/view"
				variant="contained"
				sx={{
					":hover": {
						color: "white",
					},
				}}
			>
				My Notes
			</Button>
		</Container>
	);
}
