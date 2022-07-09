import { Button } from "@mui/material";
import axios from "axios";

function LogoutButton() {
	return (
		<Button
			variant="contained"
			color="error"
			onClick={() => axios.get("/api/logout")} //then redirect to login page
		>
			Log out
		</Button>
	);
}

export default LogoutButton;
