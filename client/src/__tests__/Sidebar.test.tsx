import { render, screen, cleanup } from "@testing-library/react";
import Sidebar from "../components/Sidebar";
import LogoutButton from "../components/LogoutButton";

afterEach(() => {
	cleanup();
});

test("should render proper text and buttons", () => {
	render(<Sidebar />);
	const sidebar = screen.getByTestId("sidebar");
	expect(sidebar).toBeInTheDocument();
	expect(sidebar).toHaveTextContent("notable");
    expect(sidebar).toHaveTextContent("My Notes");
    expect(sidebar).toHaveTextContent("Presentations");
});