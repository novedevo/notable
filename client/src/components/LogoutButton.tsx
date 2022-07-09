import { Button } from "@mui/material";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function LogoutButton() {
	const navigate = useNavigate();
	return (
		<Button
			variant="contained"
			color="error"
			onClick={() => axios("/api/logout").then(() => navigate("/login"))} //then redirect to login page
		>
			Log out
		</Button>
	);
}

export default LogoutButton;
