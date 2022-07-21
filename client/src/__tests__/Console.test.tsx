import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import mockWindowProperty from "../helpers";
import Console from "../routes/Console";

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
test("renders default data", () => {
	render(
		<Router>
			<Console />
		</Router>
	);
	const header = screen.getByText("userTest");
	expect(header).toBeInTheDocument();
});
test("renders without error", () => {
	render(
		<Router>
			<Console />
		</Router>
	);
});
//todo: mock axios or the whole api
