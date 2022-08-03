import { Button } from "@mui/material";
import { useState } from "react";

export default function InputNotes({ post }: { post: (note: string) => void }) {
	const [latestNote, setLatestNote] = useState("");

	return (
		<>
			<textarea
				name=""
				id="input-notes"
				cols={20}
				rows={5}
				placeholder="Write notes here..."
				value={latestNote}
				onChange={(e) => setLatestNote(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						if (latestNote !== "") {
							post(latestNote);
						}
						setLatestNote("");
					}
				}}
				style={{
					height: "1000%",
				}}
			/>
			<Button
				style={{
					backgroundColor: "#8400ff",
					color: "white",
					top: "11rem",
					height: "2.5rem",
				}}
				onClick={(e) => {
					post(latestNote);
					setLatestNote("");
				}}
			>
				Post Note
			</Button>
		</>
	);
}
