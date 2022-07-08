import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
	return (
		<>
			<h1>
				Welcome, <span id="name">user</span>!
			</h1>
			<div id="selection"></div>
			<a
				href="/secured/adminConsole.html"
				id="admin"
				className="btn btn-primary"
				style={{ display: "none" }}
			>
				Admin Console
			</a>

			<LogoutButton />
			<Button component={Link} to="/edit" variant="contained">
				Video Notes
			</Button>
			<Button component={Link} to="/pdf" variant="contained">
				PDF Viewer
			</Button>
		</>
	);
}
