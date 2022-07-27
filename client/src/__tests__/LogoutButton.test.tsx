import { render, screen, cleanup } from "@testing-library/react";
import LogoutButton from "../components/LogoutButton";

afterEach(() => {
	cleanup();
});

test("renders without error", () => {
	render(<LogoutButton/>);
    const logoutbutton = screen.getByTestId("LogoutButton");
    expect(logoutbutton).toBeInTheDocument();
	expect(logoutbutton).toHaveTextContent("Log out");
});