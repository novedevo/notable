import InputNotes from "../components/InputNotes";
import NotesDisplay from "../components/NotesDisplay";
import Timer from "../components/Timer";

export default function PdfNotes() {
	return (
		<>
			<button id="prev">Prev</button>
			<button id="next">Next</button>
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
					<Timer />
					<NotesDisplay />
					<InputNotes />
				</div>
			</div>
		</>
	);
}
