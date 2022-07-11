import { Button, Container } from "@mui/material";

export default function Presentations() {

	return (
		<Container>
			<h1>Presentations</h1>
			<Button href="/schedulepresentation" variant="contained">
				New Presentation
			</Button>
		</Container>
	);
}