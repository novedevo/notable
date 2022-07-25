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
			<div id="background-image"></div>
			<div id="background-gradient"></div>
<<<<<<< HEAD
			<div id="inputSpace">
=======
			<div id="middlePanel">
>>>>>>> main
				<h5>
					<br></br>
				</h5>
				<h2>Create a New Account</h2>
				<h4>Start using Notable today!</h4>
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
						label="name"
						onChange={(event) => setName(event.target.value)}
					/>
					<TextField
						id="textField"
						variant="outlined"
						label="username"
						onChange={(event) => setUsername(event.target.value)}
					/>
					<TextField
						id="textField"
						variant="outlined"
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
