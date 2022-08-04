import { Button } from "@mui/material";

function LogoutButton() {
	return (
		<Button
			data-testid="LogoutButton"
			variant="contained"
			color="error"
			style={{
				width: "130px",
				zIndex: 999,
				marginLeft: "22px",
				marginTop: "550px",
			}}
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
