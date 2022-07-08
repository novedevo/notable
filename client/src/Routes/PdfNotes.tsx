import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import InputNotes from "../components/InputNotes";
import dayjs from "dayjs";

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

	return (
		<>
			<Button variant="contained">Prev</Button>
			<Button variant="contained">Next</Button>
			<span id="pagenum">no page</span>
			<input
				type="file"
				id="uploadPDF"
				accept=".pdf,application/pdf"
				required
			/>
			<button id="pagenum-note">Toggle Page Number</button>
			<div id="container">
				<canvas className="left-side"></canvas>

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
		</>
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
