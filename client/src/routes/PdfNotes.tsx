import { Button, Card, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InputNotes from "../components/InputNotes";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { Document, Page, pdfjs } from "react-pdf";
import DashboardButton from "../components/DashboardButton";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function PdfNotes() {
	const [notes, setNotes] = useState<[string, number, number][]>([]);
	const [date, setDate] = useState(dayjs());
	const [time, setTime] = useState(date.format("HH:mm:ss"));
	useEffect(() => {
		const interval = setInterval(() => {
			let diff = date.diff(dayjs());
			setTime(dayjs.duration(diff, "millisecond").humanize(true));
		}, 1000);

		return () => clearInterval(interval);
	});

	const [numPages, setNumPages] = useState(1);
	const [pageNumber, setPageNumber] = useState(0);
	const [file, setFile] = useState<File | null>(null);

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
			<input
				type="file"
				id="uploadPDF"
				accept=".pdf,application/pdf"
				required
				onChange={(e) => setFile(e.target.files?.[0] ?? null)}
			/>
			<div id="container">
				<Document
					file={file}
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
					<Container>{notes.map(generateNote)}</Container>
					<InputNotes
						post={(note) => {
							const diff = dayjs().diff(date);
							if (diff > 0 && pageNumber > 0) {
								setNotes([...notes, [note, pageNumber, diff]]);
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

function generateNote(
	[note, page, time]: [string, number, number],
	index: number
) {
	return (
		<Card key={index}>
			<Typography>{note}</Typography>
			<Typography>
				{dayjs.duration(time, "milliseconds").format("HH:mm:ss")}
			</Typography>
			<Typography>Page {page}</Typography>
		</Card>
	);
}
