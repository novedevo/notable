import { Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

// abandoned. console button conditional appearance does not work in here.
const user = JSON.parse(localStorage.getItem("user")!);
//const user = "test";
// testing note: replace user.name with user
// Drag side bar up and down by tweaking line 18 (top).

function Sidebar() {
	return (
		<div
			style={{
				width: "176px",
				height: "100%",
				zIndex: 10,
				lineHeight: "50px",
				position: "fixed",
				backgroundColor: "#1e2124",
			}}
		>
			<div
				style={{
					marginLeft: "22px",
					marginTop: "22px",
				}}
			>
				<h1>notable</h1>
			</div>
			<Button
				href="/view"
				variant="contained"
				id="buttonSidebarExtra"
				style={{
					width: "130px",
					marginLeft: "22px",
				}}
			>
				My Notes
			</Button>
			<Button
				href="/presentations"
				variant="contained"
				id="buttonSidebarExtra"
				style={{
					width: "130px",
					marginLeft: "22px",
				}}
			>
				Presentations
			</Button>
			{user.isAdmin && (
				<Button
					href="/console"
					variant="contained"
					id="buttonSecondary"
					style={{
						width: "130px",
						marginLeft: "22px",
					}}
				>
					Console
				</Button>
			)}
			<LogoutButton />
		</div>
	);
}

export default Sidebar;
