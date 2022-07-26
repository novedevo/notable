import { Button } from "@mui/material";

function DashboardButton() {
	return (
		<Button
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
