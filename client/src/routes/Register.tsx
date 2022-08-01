import { Container, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const navigate = useNavigate();

	const submit = async () => {
		try {
			const res = await axios.post("/api/register", {
				username,
				password,
				name,
			});
			if (res.data.token) {
				localStorage.setItem("token", res.data.token);
				localStorage.setItem(
					"user",
					JSON.stringify({ name, username, admin: false })
				);
				navigate("/login");
			}
		} catch (err: any) {
			if (err.response.status === 400) {
				alert("Username already exists");
			} else if (err.response.status === 500) {
				alert("Server error");
			} else {
				alert("Unknown error has occurred");
			}
		}
	};
	return (
		<Container>
			<div id="background-image"></div>
			<div id="background-gradient"></div>
			<div id="middlePanel">
				<h5>
					<br></br>
				</h5>
				<h2>Create a New Account</h2>
				<h4>Start using notable™ today!</h4>
				<div
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							submit();
						}
					}}
				>
					<TextField
						id="textField"
						variant="filled"
						label="name"
						onChange={(event) => setName(event.target.value)}
					/>
					<TextField
						id="textField"
						variant="filled"
						label="username"
						onChange={(event) => setUsername(event.target.value)}
					/>
					<TextField
						id="textField"
						variant="filled"
						label="password"
						type="password"
						onChange={(event) => setPassword(event.target.value)}
					/>
					<Button id="buttonPrimary" variant="contained" onClick={submit}>
						Register
					</Button>
					<Button
						id="buttonSecondary"
						variant="contained"
						href="/login"
						sx={{
							":hover": {
								color: "white",
							},
						}}
					>
						Log in with existing account
					</Button>
				</div>
			</div>
		</Container>
	);
}
