import { Button, List, ListItem } from "@mui/material";
import InputNotes from "../components/InputNotes";

export default function VideoNotes() {
	return (
		<>
			<label htmlFor="video-form">URL: </label>
			<input name="video-form" type="text" id="video-form" />
			<Button>Load Video</Button>
			TEST URLs YOU CAN COPY AND PASTE:
			<List>
				<ListItem>https://www.youtube.com/watch?v=LEENEFaVUzU</ListItem>
				<ListItem>
					https://www.youtube.com/watch?v=xMk8wuw7nek&ab_channel=EXCEEDINGSHADOW
				</ListItem>
			</List>
			<div id="container">
				<div className="left-side" id="player"></div>
				<div className="right-side">
					<div className="timer">Notes</div>
					<div id="notes-display"></div>
					<InputNotes />
				</div>
			</div>
		</>
	);
}
