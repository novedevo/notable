import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import jwtDecode from "jwt-decode";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	let expired = false;
	const token = localStorage.getItem("token");
	if (token) {
		const decoded = jwtDecode<{ exp: number }>(token);
		if (decoded.exp < Date.now() / 1000) {
			expired = true;
		} else if (decoded.exp > Date.now() / 1000) {
			navigate("/");
		}
	}

	const submit = () => {
		axios
			.post("/api/login", {
				username,
				password,
			})
			.then((res) => {
				if (res.data.token) {
					//set up axios to use authorization on all further requests
					axios.defaults.headers.common[
						"Authorization"
					] = `Bearer ${res.data.token}`;

					//cache token and user in localstorage
					//there are security vulnerabilities associated with this practice, but this is fine for our threat model
					localStorage.setItem("token", res.data.token);
					localStorage.setItem("user", JSON.stringify(res.data.user));
					navigate("/");
				} else {
					alert("Invalid username or password");
				}
			})
			.catch((err) => alert("invalid username or password"));
	};

	return (
		<Container>
			{expired && <h1>Your session has expired.</h1>}
			<h1>Please log in</h1>
			<div>
				<TextField
					variant="outlined"
					label="username"
					onChange={(event) => setUsername(event.target.value)}
				/>
				<TextField
					variant="outlined"
					label="password"
					type="password"
					onChange={(event) => setPassword(event.target.value)}
				/>
				<Button variant="contained" onClick={submit}>
					Log In
				</Button>
				<Button variant="contained" href="/register">
					Register a new account
				</Button>
			</div>
		</Container>
	);
}
