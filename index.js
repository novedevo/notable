import express from "express";
import session from "express-session";
import pg from "pg";

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
		res.redirect("/login.html");
	}
}
function requiresAdmin(req, res, next) {
	if (req.session.admin) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", requiresLogin, (req, res) => {
	res.sendFile(__dirname + "/secured/dashboard.html");
});

app.get("/secured/adminConsole.html", requiresAdmin, (req, res) => {
	const path = __dirname + "/secured/adminConsole.html";
	res.sendFile(path);
});

app.get("/secured/:file", requiresLogin, (req, res) => {
	res.sendFile(__dirname + "/secured/" + req.params.file);
});

app.get("/public/edit-note.html", requiresLogin, (req,res) => {
	const path = __dirname + "/public/edit-note.html";
	res.sendFile(path);
});

app.get("/public/pdfviewer.html", requiresLogin, (req,res) => {
	const path = __dirname + "/public/pdfviewer.html";
	res.sendFile(path);
});

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

app.post("/api/register", async (req, res) => {
	const { username, password, name } = req.body;
	const result = await pool.query("SELECT * FROM users WHERE username = $1", [
		username,
	]);
	if (result.rows.length > 0) {
		res.status(401).send("Username already exists");
	} else {
		try {
			await pool.query(
				"INSERT INTO users (username, password, name, admin) VALUES ($1, $2, $3, $4)",
				[username, password, name, false]
			);
			res.redirect("/login.html");
		} catch (err) {
			res.status(500).send(err);
		}
	}
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
