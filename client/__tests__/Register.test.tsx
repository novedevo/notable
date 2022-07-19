import { render, screen } from "@testing-library/react";
import React from "react";
import Register from "../src/routes/Register";

test("renders name/username/password fields", () => {
	render(<Register />);
	const inputs = ["name, username, password"].map((label) =>
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
	render(<Register />);
	const header = screen.getByText("Create a new account");
	expect(header).toBeInTheDocument();
});
