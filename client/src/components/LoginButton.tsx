import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginButton() {
	let navigate = useNavigate();
	return (
		<Button
			variant="contained"
			color="primary"
			onClick={() => navigate("/login")} //redirect to login page
		>
			Login
		</Button>
	);
}

export default LoginButton;
