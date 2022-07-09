import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";

export default function Splash() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	let user = JSON.parse(localStorage.getItem("user") || "{}");
	if (user.isLoggedIn) {
		setIsLoggedIn(true);
	} else {
		axios("/api/user").then((res) => {
			if (res.data.user) {
				setIsLoggedIn(true);
			}
		});
	}
	localStorage.setItem("user", JSON.stringify({ isLoggedIn }));
	return isLoggedIn ? <Dashboard /> : <Login />;
}
