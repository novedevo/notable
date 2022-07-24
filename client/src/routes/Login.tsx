import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import "./LandingPages.css";

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
			document.location.href = "/";
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
			<div id="background-image"></div>
			<div id="background-gradient"></div>
			<div id="inputSpace">
				{expired && <h2>Your session has expired.</h2>}
				<br></br>
				<h1>Notable</h1>
				<h4>LOGIN</h4>
				<div
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							submit();
						}
					}}
				>
					<TextField
						id="textField"
						variant="outlined"
						label="username"
						onChange={(event) => setUsername(event.target.value)}
					/>
					<br></br>
					<TextField
						id="textField"
						variant="outlined"
						label="password"
						type="password"
						onChange={(event) => setPassword(event.target.value)}
					/>
					<br></br>
					<Button id="buttonPrimary" variant="contained" onClick={submit}>
						LOGIN
					</Button>
					<br></br>
					<Button
						id="buttonSecondary"
						variant="contained"
						href="/register"
						sx={{
							":hover": {
								color: "white",
							},
						}}
					>
						Register a new account
					</Button>
				</div>
			</div>
		</Container>
	);
}
