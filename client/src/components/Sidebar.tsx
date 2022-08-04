import { Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

// testing note: replace user.name with user
// Drag side bar up and down by tweaking line 18 (top).

function Sidebar() {
	const user = JSON.parse(localStorage.getItem("user")!);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	});
	return (
		<div
			style={{
				width: "170px",
				height: "100%",
				zIndex: 10,
				lineHeight: "4em",
				position: "fixed",
				backgroundColor: "#1e2124",
			}}
			data-testid="sidebar"
		>
			<div
				style={{
					marginLeft: "1.5vw",
					marginTop: "2vh",
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
					marginLeft: "1.5vw",
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
					marginLeft: "1.5vw",
				}}
			>
				Presentations
			</Button>
			{user?.isAdmin && (
				<Button
					href="/console"
					variant="contained"
					id="buttonSecondary"
					style={{
						width: "130px",
						marginLeft: "1.5vw",
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
