import Dashboard from "./Dashboard";
import Login from "./Login";
import jwt from "jsonwebtoken";

export default function Splash() {
	let isLoggedIn = false;
	const token = localStorage.getItem("token");
	if (token) {
		const decoded = jwt.decode(token) as jwt.JwtPayload;
		if (decoded.exp! > Date.now() / 1000) {
			isLoggedIn = true;
		}
	}
	return isLoggedIn ? <Dashboard /> : <Login />;
}
