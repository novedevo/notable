import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "../routes/Register";

test("renders name/username/password fields", () => {
	render(
		<Router>
			<Register />
		</Router>
	);
	const inputs = ["name", "username", "password"].map((label) =>
		screen.getByLabelText(label)
	);
	for (const input of inputs) {
		expect(input).toBeInTheDocument();
		expect(input).toBeEnabled();
		expect(input).toBeVisible();
		expect(input).toBeInstanceOf(HTMLInputElement);
	}
});
test("renders create account prompt", () => {
	render(
		<Router>
			<Register />
		</Router>
	);
	const header = screen.getByText("Create a New Account");
	expect(header).toBeInTheDocument();
});
test("renders without error", () => {
	render(
		<Router>
			<Register />
		</Router>
	);
});
