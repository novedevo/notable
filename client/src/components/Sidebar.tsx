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
				width: "140px",
				height: "250px",
				zIndex: 10,
				lineHeight: "50px",
				top: "35%",
				position: "fixed",
			}}
		>
			<Button
				href="/view"
				variant="contained"
				id="buttonPrimary"
				style={{
					width: "130px",
				}}
			>
				Dashboard
			</Button>
			<Button
				href="/"
				variant="contained"
				id="buttonPrimary"
				style={{
					width: "130px",
				}}
			>
				Presentations
			</Button>
			{user.name && (
				<Button
					href="/console"
					variant="contained"
					id="buttonSecondary"
					style={{
						width: "130px",
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
