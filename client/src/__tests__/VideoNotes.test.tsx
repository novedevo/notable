import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import mockWindowProperty from "../helpers";
import VideoNotes from "../routes/VideoNotes";
import { io } from "socket.io-client";

const storage: {
	[key: string]: string;
} = {
	user: JSON.stringify({ user: { username: "test" } }),
	token: "mock auth token",
};

mockWindowProperty("localStorage", {
	setItem: jest.fn(),
	getItem: (key: string) => storage[key],
	removeItem: jest.fn(),
});
mockWindowProperty("alert", jest.fn());
//todo: check that this was called, since in this test youtube url is not set correctly & network is not mocked yet
test("renders buttons", () => {
	render(
		<Router>
			<VideoNotes url="" inputNotes={[]} presentationId={1} socket={io()} />
		</Router>
	);
	const buttons = ["Post Note", "Return to Dashboard", "Notes"].map((label) =>
		screen.getByText(label)
	);
	for (const button of buttons) {
		expect(button).toBeInTheDocument();
		expect(button).toBeEnabled();
		expect(button).toBeVisible();
	}
});
test("renders without error", () => {
	render(
		<Router>
			<VideoNotes url="" inputNotes={[]} presentationId={1} socket={io()} />
		</Router>
	);
});
