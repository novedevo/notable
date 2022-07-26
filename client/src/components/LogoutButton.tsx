import { Button } from "@mui/material";

function LogoutButton() {
	return (
		<Button
			variant="contained"
			color="error"
			style={{
				width: "130px",
				zIndex: 999,
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
