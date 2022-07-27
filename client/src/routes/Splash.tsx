import ViewNotes from "./ViewNotes";
import Login from "./Login";
import jwtDecode from "jwt-decode";

export default function Splash() {
	let isLoggedIn = false;
	const token = localStorage.getItem("token");
	if (token) {
		console.log(token);
		const decoded = jwtDecode<{ exp: number }>(token);
		console.log(decoded);
		if (decoded.exp > Date.now() / 1000) {
			isLoggedIn = true;
		}
	}
	return isLoggedIn ? <ViewNotes /> : <Login />;
}
