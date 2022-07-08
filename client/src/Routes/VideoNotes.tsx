import {
	Button,
	Container,
	List,
	ListItem,
	TextField,
	Typography,
} from "@mui/material";
import InputNotes from "../components/InputNotes";
import NotesDisplay from "../components/NotesDisplay";
import Video from "../components/Video";

export default function VideoNotes() {
	return (
		<>
			<TextField variant="outlined" id="video-form" label="URL" />
			<Button>Load Video</Button>
			TEST URLs YOU CAN COPY AND PASTE:
			<List>
				<ListItem>https://www.youtube.com/watch?v=LEENEFaVUzU</ListItem>
				<ListItem>
					https://www.youtube.com/watch?v=xMk8wuw7nek&ab_channel=EXCEEDINGSHADOW
				</ListItem>
			</List>
			<Container>
				<Video />
				<div className="right-side">
					<Typography>Notes</Typography>
					<NotesDisplay />
					<InputNotes />
				</div>
			</Container>
		</>
	);
}
