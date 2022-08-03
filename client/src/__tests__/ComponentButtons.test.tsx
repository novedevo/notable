import { render, screen, cleanup } from "@testing-library/react";
import LogoutButton from "../components/LogoutButton";
import LoginButton from "../components/LoginButton";
import DashboardButton from "../components/DashboardButton";

afterEach(() => {
	cleanup();
});

test("logout button renders without error", () => {
	render(<LogoutButton />);
	const logoutbutton = screen.getByTestId("LogoutButton");
	expect(logoutbutton).toBeInTheDocument();
	expect(logoutbutton).toHaveTextContent("Log out");
});

test("login button renders without error", () => {
	render(<LoginButton />);
	const loginbutton = screen.getByTestId("LoginButton");
	expect(loginbutton).toBeInTheDocument();
	expect(loginbutton).toHaveTextContent("Login");
});

test("dashboard button renders without error", () => {
	render(<DashboardButton />);
	const dashboardbutton = screen.getByTestId("DashboardButton");
	expect(dashboardbutton).toBeInTheDocument();
	expect(dashboardbutton).toHaveTextContent("Return to Dashboard");
	expect(dashboardbutton).toHaveAttribute("href", "/");
});
