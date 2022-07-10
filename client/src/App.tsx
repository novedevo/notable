import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import Splash from "./Routes/Splash";
import Console from "./Routes/Console";
import VideoNotes from "./Routes/VideoNotes";
import PdfNotes from "./Routes/PdfNotes";

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
