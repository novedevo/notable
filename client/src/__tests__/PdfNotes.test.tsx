import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import mockWindowProperty from "../helpers";
import PdfNotes from "../routes/PdfNotes";

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
test("renders buttons", () => {
	render(
		<Router>
			<PdfNotes pdf="" inputNotes={[]} startTime="" />
		</Router>
	);
	const buttons = ["Previous", "Return to Dashboard", "Next"].map((label) =>
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
			<PdfNotes pdf="" inputNotes={[]} startTime="" />
		</Router>
	);
});
