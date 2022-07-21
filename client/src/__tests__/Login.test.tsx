import { render, screen } from "@testing-library/react";
import Login from "../routes/Login";

import { BrowserRouter as Router } from "react-router-dom";

test("renders without errors", () => {
	render(
		<Router>
			<Login />
		</Router>
	);
});

test("renders username/password fields", () => {
	render(
		<Router>
			<Login />
		</Router>
	);
	const inputs = ["username", "password"].map((label) =>
		screen.getByLabelText(label)
	);
	for (const input of inputs) {
		expect(input).toBeInTheDocument();
		expect(input).toBeEnabled();
		expect(input).toBeVisible();
		expect(input).toBeInstanceOf(HTMLInputElement);
	}
});
test("renders submit button", () => {
	render(
		<Router>
			<Login />
		</Router>
	);
	const submit = screen.getByText("Log In");
	expect(submit).toBeInTheDocument();
	expect(submit).toBeEnabled();
	expect(submit).toBeVisible();
	expect(submit).toBeInstanceOf(HTMLButtonElement);
});
