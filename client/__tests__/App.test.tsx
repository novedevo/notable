import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("renders a login prompt", () => {
	render(<App />);
	const linkElement = screen.getByText("Please log in");
	expect(linkElement).toBeInTheDocument();
});
