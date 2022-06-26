import express from "express";
import pg from "pg";

//initialize postgres connection
const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/notable",
	ssl: {
		rejectUnauthorized: false,
	},
});
await pool.connect();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;
	const result = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
	if (result.rows.length === 0) {
		res.status(401).send("Invalid username or password");
	} else {
		res.redirect("/dashboard");
	}
});
