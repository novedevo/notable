import { Button, Container } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	//const user = JSON.parse(localStorage.getItem("user")!);
	const user = "Hack1";

	return (
		<Container>
			<h1>Welcome, {user}!</h1>
			{user && (
				<Button
					href="/console"
					variant="contained"
					sx={{
						":hover": {
							color: "white",
						},
					}}
				>
					Admin Console
				</Button>
			)}
			<LogoutButton />
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
