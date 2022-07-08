import { Button } from "@mui/material";

export default function InputNotes() {
	return (
		<>
			<textarea
				name=""
				id="input-notes"
				cols={20}
				rows={5}
				placeholder="Write notes here..."
			/>
			<Button>Post Note</Button>
		</>
	);
}
