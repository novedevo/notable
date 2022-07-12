import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Splash from "./routes/Splash";
import Console from "./routes/Console";
import VideoNotes from "./routes/VideoNotes";
import PdfNotes from "./routes/PdfNotes";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Splash />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/console" element={<Console />} />
				<Route path="/edit" element={<VideoNotes />} />
				<Route path="/pdf" element={<PdfNotes />} />
			</Routes>
		</BrowserRouter>
	);
}
