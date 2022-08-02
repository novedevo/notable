import { Socket } from "socket.io-client";
import { Note, PdfNote } from "../types";
import { PdfNoteComponent, VideoNoteComponent } from "./Note";

export default function PublicNotes(props: {
	notes: Note[];
	pdf: boolean;
	socket: Socket;
	presentationId: number;
}) {
	const NoteComponent = props.pdf ? PdfNoteComponent : VideoNoteComponent;
	return (
		<>
			<h3>All notes taken for this presentation:</h3>
			<ul>
				{props.notes.map((note) => (
					<NoteComponent
						{...(note as PdfNote)} //static typing is a little broken here, could use some work
						key={note.note_id}
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
