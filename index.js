import express from "express";
import session from "express-session";
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
		res.sendFile("secured/index.html");
	} else {
		res.redirect("/login");
	}
});

app.post("/api/login", express.urlencoded(), async (req, res) => {
	const { username, password } = req.body;
	const result = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);
	if (result.rows.length === 0) {
		res.status(401).send("Invalid username or password");
	} else {
		req.session.regenerate(() => {
			req.session.user = username;
			req.session.save(() => res.redirect("/"));
		});
	}
});
