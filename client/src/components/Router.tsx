import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../Routes/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" />
				<Route
					path="/dashboard"
					element={<ProtectedRoute component={Dashboard} />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
