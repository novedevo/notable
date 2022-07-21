import { Container, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const navigate = useNavigate();

	const submit = () => {
		axios
			.post("/api/register", { username, password, name })
			.then((res) => {
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
					localStorage.setItem(
						"user",
						JSON.stringify({ name, username, admin: false })
					);
					navigate("/login");
				}
			})
			.catch((err) => alert("invalid username or password"));
	};
	return (
		<Container>
			<h1>Create a new account</h1>
			<div
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						submit();
					}
				}}
			>
				<TextField
					variant="outlined"
					label="name"
					onChange={(event) => setName(event.target.value)}
				/>
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
					Register
				</Button>
				<Button
					variant="contained"
					href="/login"
					sx={{
						":hover": {
							color: "white",
						},
					}}
				>
					Log in with an existing account
				</Button>
			</div>
		</Container>
	);
}
