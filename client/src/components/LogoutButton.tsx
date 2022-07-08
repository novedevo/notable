import React from "react";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";

function LogoutButton() {
	const { logout } = useAuth0();
	return (
		<Button
			variant="contained"
			color="primary"
			onClick={() => logout({ returnTo: window.location.origin })}
		>
			Log out
		</Button>
	);
}

export default LogoutButton;
