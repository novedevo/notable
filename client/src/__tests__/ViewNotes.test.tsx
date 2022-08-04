import { render, screen, cleanup } from "@testing-library/react";
import ViewNotes from "../routes/ViewNotes";

afterEach(() => {
	cleanup();
});

test("should properly render ViewNotes component", () => {
	render(<ViewNotes />);
	const ViewNotesComponent = screen.getByTestId("ViewNotes-component");
	expect(ViewNotesComponent).toBeInTheDocument();
	expect(ViewNotesComponent).toHaveTextContent("View Notes");
});
