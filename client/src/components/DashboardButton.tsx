import { Button } from "@mui/material";

function DashboardButton() {
	return (
		<Button
			data-testid="DashboardButton"
			href="/"
			color="info"
			variant="contained"
			style={{
				zIndex: 10,
				position: "fixed",
			}}
			sx={{
				":hover": {
					color: "white",
				},
			}}
		>
			Return to Dashboard
		</Button>
	);
}

export default DashboardButton;
//<DashboardButton />
