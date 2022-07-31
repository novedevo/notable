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
		console.log(user);
		if (!user) {
			navigate("/login");
		}
	});
	return (
		<div
			style={{
				width: "10vw",
				minWidth: "176px",
				height: "100vh",
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
			{user?.isAdmin && (
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
