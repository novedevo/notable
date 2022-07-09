import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../Routes/Dashboard";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}
