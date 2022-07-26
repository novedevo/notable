import "./App.css";
import "./Presentations.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Splash from "./routes/Splash";
import Console from "./routes/Console";
import ViewNotes from "./routes/ViewNotes";
import SchedulePresentation from "./routes/SchedulePresentation";
import Presentations from "./routes/Presentations";
import Room from "./routes/Room";
import Edit from "./routes/PresentationEdit";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Splash />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/console" element={<Console />} />
				<Route path="/view" element={<ViewNotes />} />
				<Route path="/presentations" element={<Presentations />} />
				<Route
					path="/schedulepresentation"
					element={<SchedulePresentation />}
				/>
				<Route path="/room/:id" element={<Room />} />
				<Route path="/edit/:id" element={<Edit />} />
			</Routes>
		</BrowserRouter>
	);
}
