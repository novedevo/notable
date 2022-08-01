import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders a notable header", () => {
	render(<App />);
	const headerElement = screen.getByText("notable");
	expect(headerElement).toBeInTheDocument();
	expect(headerElement).toBeVisible();
	expect(headerElement).toBeInstanceOf(HTMLHeadingElement);
});
