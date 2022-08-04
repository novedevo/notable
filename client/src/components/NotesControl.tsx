import { FormControlLabel, Checkbox } from "@mui/material";
import { AxiosInstance } from "axios";
import { Socket } from "socket.io-client";

export default function NotesControl(props: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	client: AxiosInstance;
	presentationId: number;
	socket: Socket;
}) {
	return (
		<div>
			<FormControlLabel
				control={
					<Checkbox
						checked={props.visible}
						onChange={(e) =>
							props.client
								.patch("/api/noteVisibility", {
									visible: e.target.checked,
									id: props.presentationId,
								})
								.then((res) => {
									props.socket.emit("note_visibility", {
										room: props.presentationId,
									});
									props.setVisible(!e.target.checked);
								})
								.catch((err) => console.error(err))
						}
					/>
				}
				label="Share with the class"
			/>
		</div>
	);
}
