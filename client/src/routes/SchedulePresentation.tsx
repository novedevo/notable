import { Button, Container, TextField } from "@mui/material";

export default function SchedulePresentation() {

	return (
		<Container>
			<h1>Schedule Presentation</h1>

            <TextField
				variant="outlined"
				id="title"
				label="Title"
			/>
            
            <Button href="" variant="contained">
				Save and Generate Code
			</Button>

            <div>Your Presentation Code: </div>
		</Container>
	);
}