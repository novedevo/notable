import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
	const navigate = useNavigate();
	return (
		<Button
			variant="contained"
			color="error"
			onClick={() => {
				localStorage.clear();
				navigate("/");
			}} //then redirect to login page
		>
			Log out
		</Button>
	);
}

export default LogoutButton;
