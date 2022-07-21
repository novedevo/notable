import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import mockWindowProperty from "../helpers";
import Presentations from "../routes/Presentations";

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
			<Presentations />
		</Router>
	);
	const buttons = [
		"Schedule Presentation",
		"Return to Dashboard",
		"Join a Presentation",
	].map((label) => screen.getByText(label));
	for (const button of buttons) {
		expect(button).toBeInTheDocument();
		expect(button).toBeEnabled();
		expect(button).toBeVisible();
	}
});
test("renders without error", () => {
	render(
		<Router>
			<Presentations />
		</Router>
	);
});
