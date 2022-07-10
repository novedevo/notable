import { Button } from "@mui/material";

function LogoutButton() {
	return (
		<Button
			variant="contained"
			color="error"
			onClick={() => {
				localStorage.clear();
				console.log(localStorage.getItem("token"));
				document.location.href = "/";
			}} //then redirect to login page
		>
			Log out
		</Button>
	);
}

export default LogoutButton;
