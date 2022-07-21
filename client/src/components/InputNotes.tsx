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
				onChange={(e) => setLatestNote(e.target.value.trim())}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						if (latestNote !== "") {
							post(latestNote);
						}
						e.target.value = "";
					}
				}}
			/>
			<Button
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
