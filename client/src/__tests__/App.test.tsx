import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders a login prompt", () => {
	render(<App />);
	const linkElement = screen.getByText("Notable");
	expect(linkElement).toBeInTheDocument();
});
