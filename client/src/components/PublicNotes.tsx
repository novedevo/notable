import axios from "axios";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Note, PdfNote } from "../types";
import { PdfNoteComponent, VideoNoteComponent } from "./Note";

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function PublicNotes(props: {
	pdf: boolean;
	socket: Socket;
	presentationId: number;
	player?: string;
}) {
	const [notes, setNotes] = useState<Note[]>([]);
	const NoteComponent = props.pdf ? PdfNoteComponent : VideoNoteComponent;
	useEffect(() => {
		props.socket.on("note_list", (data: Note[]) => {
			setNotes(data);
		});
		//
	}, [props.socket]);
	useEffect(() => {
		getNotes(props.presentationId).then(setNotes);
	}, [props.presentationId]);

	return (
		<>
			<ul className="notes-display">
				{notes.map((note) => (
					<NoteComponent
						{...(note as PdfNote)} //static typing is a little broken here, could use some work
						key={note.note_id}
						player={props.player}
						onDelete={() =>
							props.socket.emit("delete_note", {
								room: props.presentationId,
								note_id: note.note_id,
							})
						}
					/>
				))}
			</ul>
		</>
	);
}
async function getNotes(presentationId: number): Promise<Note[]> {
	try {
		const result = await client("/api/publicNotes/" + presentationId);
		return result.data;
	} catch (err) {
		alert("Failed to get notes: " + err);
		return [];
	}
}
