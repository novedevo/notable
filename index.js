import express from "express";
import pg from "pg";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

//initialize postgres connection
const { Pool } = pg;
const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		"postgres://postgres:postgres@localhost/notable",
	ssl: process.env.DATABASE_URL
		? {
				rejectUnauthorized: false,
		  }
		: false,
});
await pool.connect();

//setup constants
const PORT = process.env.PORT || 5000;
const __dirname = import.meta.url
	.replace("file://", "")
	.replace("/index.js", "");

//setup authentication
const requiresLogin = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: "https://dev--9y96m38.us.auth0.com/.well-known/jwks.json",
	}),
	audience: "notable-api",
	issuer: "https://dev--9y96m38.us.auth0.com/",
	algorithms: ["RS256"],
});

//initialize express
const app = express();

app.use(express.static("build")); //serve react application
app.use(express.urlencoded({ extended: true }));

// API section

app.get("/api/notes", requiresLogin, async (req, res) => {
	const result = await pool.query("SELECT * FROM notes WHERE username = $1", [
		req.body.user,
	]);
	res.json(result.rows?.[0]);
});

app.get("/*", (req, res) => {
	res.sendFile(__dirname + "/build/index.html");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
