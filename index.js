import express from "express";
import session from "express-session";
import pg from "pg";

//initialize postgres connection
const { Pool } = pg;
const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		"postgres://postgres:postgres@localhost/notable",
	ssl: {
		rejectUnauthorized: false,
	},
});
await pool.connect();

const PORT = process.env.PORT || 5000;

const __dirname = import.meta.url
	.replace("file://", "")
	.replace("/index.js", "");
const app = express();

app.use(
	session({
		secret: "notable",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 * 2, //two weeks
		},
	})
);
app.use(express.static("public"));

app.get("/", (req, res) => {
	const session = req.session;
	if (session.user) {
		res.sendFile(__dirname + "/secured/index.html");
	} else {
		res.redirect("/login.html");
	}
});

app.post(
	"/api/login",
	express.urlencoded({ extended: true }),
	async (req, res) => {
		const { username, password } = req.body;
		const result = await pool.query(
			"SELECT * FROM users WHERE username = $1 AND password = $2",
			[username, password]
		);
		if (result.rows.length === 0) {
			res.status(401).send("Invalid username or password");
		} else {
			req.session.regenerate(() => {
				req.session.user = username;
				req.session.save(() => res.redirect("/"));
			});
		}
	}
);

app.post("/api/logout", (req, res) => {
	req.session.destroy(() => res.redirect("/"));
});

app.post(
	"/api/register",
	express.urlencoded({ extended: true }),
	async (req, res) => {
		const { username, password, name } = req.body;
		const result = await pool.query("SELECT * FROM users WHERE username = $1", [
			username,
		]);
		if (result.rows.length > 0) {
			res.status(401).send("Username already exists");
		} else {
			await pool.query(
				"INSERT INTO users (username, password, name) VALUES ($1, $2, $3)",
				[username, password, name]
			);
			res.redirect("/login.html");
		}
	}
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
