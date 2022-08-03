import { Container } from "@mui/material";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import InputNotes from "../components/InputNotes";
import { VideoNote } from "../types";
import { VideoNoteComponent } from "../components/Note";
import axios from "axios";
import { Socket } from "socket.io-client";
import NotesControl from "../components/NotesControl";
import PublicNotes from "../components/PublicNotes";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function VideoNotes(props: {
	url: string;
	inputNotes: VideoNote[];
	presentationId: number;
	socket: Socket;
}) {
	const videoId = parseId(props.url);
	const [visible, setVisible] = useState(props.inputNotes[0]?.visible ?? true);
	const [notes, setNotes] = useState<VideoNote[]>(props.inputNotes);
	const [player, setPlayer] = useState<YouTubePlayer>(null);

	const presentationId = parseInt(window.location.pathname.split("/").pop()!);

	const [value, setValue] = React.useState("1");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<div>
			<div id="containerIfSidebar">
				<div id="adjustableSize">
					<YouTube
						id="YoutubeVideo"
						videoId={videoId}
						opts={{
							height: 800,
							width: 1000,
							playerVars: {
								// autoplay: 1,
								playsInline: 1,
								modestBranding: 1,
							},
						}}
						onReady={(event) => setPlayer(event.target)}
					/>
				</div>
				<div className="right-side">
					<Box sx={{ width: "100%", typography: "body1" }}>
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
								<TabList onChange={handleChange} aria-label="chat tabs">
									<Tab label="Your Notes" value="1" />
									<Tab label="Everyone's Notes" value="2" />
								</TabList>
							</Box>
							<TabPanel value="1">
								<NotesControl
									socket={props.socket}
									presentationId={presentationId}
									visible={visible}
									setVisible={setVisible}
									client={client}
								/>
								<Container className="notes-display">
									{notes.map((note, i) => (
										<VideoNoteComponent
											{...note}
											key={note.note_id}
											player={player}
										/>
									))}
								</Container>
								<InputNotes
									post={
										async (value) => {
											const time = player.getCurrentTime();
											const result = await client.post("/api/addNote", {
												note: value,
												timestamp: time,
												presentationId,
												visible,
											});
											props.socket.emit("add_note", { room: presentationId });
											setNotes([
												...notes,
												{
													note: value,
													time_stamp: time,
													note_id: result.data[0].note_id,
													visible,
												},
											]);
										}
										//todo: add socket communication to update server notes
									}
								/>
							</TabPanel>
							<TabPanel value="2">
								<PublicNotes
									socket={props.socket}
									presentationId={presentationId}
									pdf={false}
								/>
							</TabPanel>
						</TabContext>
					</Box>
				</div>
			</div>
		</div>
	);
}

// Method, YT Parser. Very specific, just one way of doing this.
function parseId(url: string) {
	// Regular expression, all possible combinations before YT unique ID.
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

	// Comparison between arg and the regular expression
	const match = url.match(regExp)?.[2];

	if (match?.length === 11) {
		return match;
	} else {
		alert("invalid url");
	}
}
