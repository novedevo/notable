import express from "express";
import session from "express-session";
import pg from "pg";
import cors from "cors";

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
// const __dirname = import.meta.url
// 	.replace("file://", "")
// 	.replace("/index.js", "");

//initialize express
const app = express();

//setup express-session
app.use(
	session({
		secret: "notable", //really should be a truly secure string, but this is fine considering we have zero real adversaries
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 * 2, //two weeks
		},
	})
);

function requiresLogin(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}
function requiresAdmin(req, res, next) {
	if (req.session.admin) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}

app.use(express.static("client/build"));
app.use(express.urlencoded({ extended: true }));
app.use(
	"/api/*",
	cors({
		origin: [
			`http://localhost:${PORT}`,
			`https://stormy-plateau-24106.herokuapp.com`,
		],
	})
);

// API section

app.post("/api/login", async (req, res) => {
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
			req.session.name = result.rows[0].name;
			req.session.admin = result.rows[0].admin;
			req.session.save(() => res.redirect("/"));
		});
	}
});

app.get("/logout", requiresLogin, (req, res) => {
	req.session.destroy(() => res.redirect("/"));
});

app.get("/api/users", requiresAdmin, async (req, res) => {
	const result = await pool.query("SELECT username, name, admin FROM users");
	res.json(result.rows);
});
app.get("/api/user_info", requiresLogin, async (req, res) => {
	const result = await pool.query("SELECT * FROM users WHERE username = $1", [
		req.session.user,
	]);
	res.json(result.rows?.[0]);
});
app.patch("/api/promote_user", requiresAdmin, async (req, res) => {
	await pool.query("UPDATE users SET admin = true WHERE username = $1", [
		req.query.username,
	]);
	res.send("User promoted");
});
app.patch("/api/demote_user", requiresAdmin, async (req, res) => {
	await pool.query("UPDATE users SET admin = false WHERE username = $1", [
		req.query.username,
	]);
	res.send("User demoted");
});
app.delete("/api/delete_user", requiresAdmin, async (req, res) => {
	const result = await pool.query("DELETE FROM users WHERE username = $1", [
		req.query.username,
	]);
	if (result.rowCount) {
		res.send("User deleted");
	}
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
