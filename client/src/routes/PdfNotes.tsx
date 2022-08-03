import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import InputNotes from "../components/InputNotes";
import NotesControl from "../components/NotesControl";
import dayjs from "dayjs";
import axios from "axios";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { Document, Page, pdfjs } from "react-pdf";
import { PdfNote } from "../types";
import Pagination from "react-bootstrap/Pagination";
import "./AppExtras.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { PdfNoteComponent } from "../components/Note";
import { Socket } from "socket.io-client";
import PublicNotes from "../components/PublicNotes";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

dayjs.extend(duration);
dayjs.extend(relativeTime);

const client = axios.create({
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default function PdfNotes(props: {
	pdf: string;
	startTime: string;
	inputNotes: PdfNote[];
	socket: Socket;
}) {
	const [visible, setVisible] = useState(props.inputNotes[0]?.visible ?? true);
	const [notes, setNotes] = useState<PdfNote[]>(props.inputNotes);
	const date = dayjs(props.startTime);
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

	const presentationId = parseInt(window.location.pathname.split("/").pop()!);

	const [value, setValue] = React.useState("1");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<Container>
			<div
				id="invisibleHead"
				style={{ display: "block", width: 700, padding: 30 }}
			>
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
			<div>
				<Document
					file={props.pdf}
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
					<Container>
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
										{notes.map((note) => (
											<PdfNoteComponent {...note} key={note.note_id} />
										))}
									</Container>
								</TabPanel>
								<TabPanel value="2">
									<PublicNotes
										socket={props.socket}
										presentationId={presentationId}
										pdf={true}
									/>
								</TabPanel>
							</TabContext>
						</Box>
					</Container>
					<InputNotes
						post={async (note) => {
							const diff = dayjs().diff(date);
							if (diff > 0 && pageNumber > 0) {
								try {
									const result = await client.post("/api/addNote", {
										note: note,
										timestamp: diff,
										pageNumber,
										presentationId,
										visible,
									});
									props.socket.emit("add_note", { room: presentationId });
									setNotes([
										...notes,
										{
											note,
											page_number: pageNumber,
											time_stamp: diff,
											note_id: result.data[0].note_id,
											visible,
										},
									]);
								} catch (err) {
									console.error(err);
									alert(err);
								}
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
