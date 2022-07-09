import "./App.css";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import Splash from "./Routes/Splash";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Splash />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	);
}
