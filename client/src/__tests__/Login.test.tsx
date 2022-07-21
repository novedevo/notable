import { render, screen } from "@testing-library/react";
import React from "react";
import Login from "../routes/Login";

test("renders username/password fields", () => {
	render(<Login />);
	const inputs = ["username, password"].map((label) =>
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
	render(<Login />);
	const submit = screen.getByText("Submit");
	expect(submit).toBeInTheDocument();
	expect(submit).toBeEnabled();
	expect(submit).toBeVisible();
	expect(submit).toBeInstanceOf(HTMLButtonElement);
});
