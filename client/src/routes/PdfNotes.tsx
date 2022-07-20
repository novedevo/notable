import { Button, Card, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InputNotes from "../components/InputNotes";
import dayjs from "dayjs";
import axios from "axios";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { Document, Page, pdfjs } from "react-pdf";
import DashboardButton from "../components/DashboardButton";
import { PdfNote } from "../types";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

dayjs.extend(duration);
dayjs.extend(relativeTime);

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
	const [date, setDate] = useState(dayjs(startTime));
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
	const dec = () => {
		if (pageNumber !== 1) {
			setPageNumber(pageNumber - 1);
		}
	};

	return (
		<Container>
			<DashboardButton />
			<Button variant="contained" onClick={dec}>
				Prev
			</Button>
			<Button variant="contained" onClick={inc}>
				Next
			</Button>
			<span id="pagenum">{pageNumber}</span>
			<div id="container">
				<Document
					file={pdf}
					onLoadSuccess={({ numPages }) => {
						setNumPages(numPages);
						setPageNumber(1);
					}}
				>
					<Page
						pageNumber={pageNumber || 1}
						renderTextLayer={false} //https://github.com/wojtekmaj/react-pdf/issues/332
					/>
				</Document>
				<div className="right-side">
					<Container>
						<br />
						<TextField
							label="Beginning of Presentation"
							type="datetime-local"
							defaultValue={date.format("YYYY-MM-DDTHH:mm")}
							onChange={(e) => {
								setDate(dayjs(e.target.value));
							}}
						/>
						{time}
					</Container>
					<Container id="notes-display">{notes.map(generateNote)}</Container>
					<InputNotes
						post={(note) => {
							const diff = dayjs().diff(date);
							if (diff > 0 && pageNumber > 0) {
								setNotes([...notes, { note, page_number: pageNumber, diff }]);
								axios.post(
									"/api/addNote",
									{
										note: note,
										timestamp: diff,
										pageNumber: pageNumber,
									},
									{
										headers: {
											Authorization: `Bearer ${localStorage.getItem("token")}`,
										},
									}
								);
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
	);
}

function generateNote(note: PdfNote, index: number) {
	return (
		<Card key={index}>
			<Typography>{note.note}</Typography>
			<Typography>
				{dayjs.duration(note.diff, "milliseconds").format("HH:mm:ss")}
			</Typography>
			<Typography>Page {note.page_number}</Typography>
		</Card>
	);
}
