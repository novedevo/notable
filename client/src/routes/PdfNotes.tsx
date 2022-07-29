import { Button, Card, Container, Typography } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import InputNotes from "../components/InputNotes";
import dayjs from "dayjs";
import axios from "axios";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { Document, Page, pdfjs } from "react-pdf";
import Sidebar from "../components/Sidebar";
import { PdfNote } from "../types";
import Pagination from "react-bootstrap/Pagination";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

dayjs.extend(duration);
dayjs.extend(relativeTime);

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function PdfNotes({
	pdf,
	startTime,
	inputNotes,
}: {
	pdf: string;
	startTime: string;
	inputNotes: PdfNote[];
}) {
	const [notes, setNotes] = useState<PdfNote[]>(inputNotes);
	const date = dayjs(startTime);
	const [time, setTime] = useState(date.format("HH:mm:ss"));
	useEffect(() => {
		const interval = setInterval(() => {
			const diff = date.diff(dayjs());
			setTime(dayjs.duration(diff, "millisecond").humanize(true));
		}, 1000);

		return () => clearInterval(interval);
	});

	const [numPages, setNumPages] = useState(1);
	const [pageNumber, setPageNumber] = useState(0);

	const inc = () => {
		if (pageNumber !== numPages) {
			setPageNumber(pageNumber + 1);
		}
	};
	const last = () => {
		setPageNumber(numPages);
	};
	const first = () => {
		setPageNumber(1);
	};
	const dec = () => {
		if (pageNumber !== 1) {
			setPageNumber(pageNumber - 1);
		}
	};
	const updatePage = (pageNum: number) => {
		if (pageNum > numPages) {
			return;
		} else {
			setPageNumber(pageNum);
		}
	};

	return (
		<div>
			<Container>
				<Button variant="contained" onClick={inc}>
					Next
				</Button>
				<div style={{ display: "block", width: 700, padding: 30 }}>
					<Pagination size="lg">
						<Pagination.First onClick={first} />
						<Pagination.Prev onClick={dec} />
						<input
							style={{ width: 60, height: 57 }}
							type="number"
							value={pageNumber}
							onChange={(e) => updatePage(parseInt(e.target.value))}
						></input>
						<Pagination.Next onClick={inc} />
						<Pagination.Last onClick={last} />
					</Pagination>
				</div>
				<div id="container">
					<Document
						file={pdf}
						onLoadSuccess={({ numPages }) => {
							setNumPages(numPages);
							setPageNumber(1);
						}}
						renderMode="svg"
					>
						<Page
							pageNumber={pageNumber || 1}
							renderTextLayer={false} //https://github.com/wojtekmaj/react-pdf/issues/332
							width={800}
						/>
					</Document>
					<div className="right-side">
						<Container>
							Presentation start{dayjs().diff(date) > 0 ? "ed " : "s at "}
							{date.format("YYYY-MM-DDTHH:mm")}, {time}
						</Container>
						<Container id="notes-display">{notes.map(generateNote)}</Container>
						<InputNotes
							post={async (note) => {
								const diff = dayjs().diff(date);
								const id = JSON.parse(localStorage.getItem("user")!).id;
								const currentURL = window.location.href;
								const presentationId = currentURL.split("room/")[1];
								console.log(id);
								if (diff > 0 && pageNumber > 0) {
									const result = await client.post("/api/addNote", {
										note: note,
										timestamp: diff,
										pageNumber: pageNumber,
										notetakerId: id,
										presentationId: presentationId,
									});
									setNotes([
										...notes,
										{
											note,
											page_number: pageNumber,
											time_stamp: diff,
											note_id: result.data[0].note_id,
										},
									]);
									//todo: add socket communication to update server notes
								} else if (pageNumber > 0) {
									alert("You can't post notes until the presentation starts");
								} else {
									alert("Please load a PDF to begin taking notes");
								}
							}}
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}

function generateNote(note: PdfNote, index: number) {
	return (
		<Card key={index}>
			<Typography>{note.note}</Typography>
			<Typography>
				{dayjs.duration(note.time_stamp, "milliseconds").format("HH:mm:ss")}
			</Typography>
			<Typography>
				Page {note.page_number}
				<Button value={note.note_id} onClick={deleteNote}>
					delete
				</Button>
			</Typography>
		</Card>
	);
}

function deleteNote(event: {
	currentTarget: {
		value: any;
	};
}) {
	console.log("Note Deleted ", event.currentTarget.value);
	client
		.delete(`/api/note/${event.currentTarget.value}`)
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => alert("invalid note: " + err.message));

	window.location.reload();
}
