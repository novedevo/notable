import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import InputNotes from "../components/InputNotes";
import dayjs from "dayjs";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import _ from "lodash";

export default function PdfNotes() {
	const [notes, setNotes] = useState<string[]>([]);
	const [date, setDate] = useState(dayjs());
	const [time, setTime] = useState("");
	setInterval(() => {
		let diff = dayjs().diff(date, "second");
		let neg = diff < 0;
		setTime(
			dayjs(Math.abs(diff)).format("HH:mm:ss") + neg ? "from now" : "ago"
		);
	}, 1000);

	const [numPages, setNumPages] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
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
					onLoadSuccess={({ numPages }) => setNumPages(numPages)}
				>
					{_.range(numPages).map((i) => (
						<Page pageNumber={i + 1} />
					))}
				</Document>

				<div className="right-side">
					<Container>
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
					<Container>{notes.map((note) => generateNote(note, date))}</Container>
					<InputNotes post={(note) => setNotes([...notes, note])} />
				</div>
			</div>
		</Container>
	);
}

function generateNote(note: string, date: dayjs.Dayjs) {
	const diff = dayjs().diff(date, "second");
	if (diff < 0) {
		alert("You can't add notes until the presentation has started");
	}
	return (
		<Container>
			<Typography>{note}</Typography>
			<Typography>{dayjs(diff).format("HH:mm:ss")}</Typography>
		</Container>
	);
}
