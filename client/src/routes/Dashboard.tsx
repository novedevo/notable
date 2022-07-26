import { Button, Container } from "@mui/material";
import LogoutButton from "../components/LogoutButton";
import "./AppExtras.css";

export default function Dashboard() {
	const user = JSON.parse(localStorage.getItem("user")!);

	return (
		<Container>
			<div id="background-image"></div>
			<div>
				<div id="pageHead">
					<h1>Welcome, {user.name}!</h1>
				</div>

				<div id="middlePanel">
					<br></br>
					<h2>Dashboard</h2>

					{user.isAdmin && (
						<Button
							id="buttonSecondary"
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
					<Button
						id="buttonPrimary"
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
					<br></br>
					<Button
						id="buttonPrimary"
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
					<br></br>
					<LogoutButton />
				</div>
			</div>
		</Container>
	);
}
