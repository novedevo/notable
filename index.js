import express from "express";
import pg from "pg";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from "http";

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

function generateAccessToken(username, isAdmin) {
	const payload = {
		username,
		isAdmin,
	};
	return jwt.sign(payload, "notable-secret", { expiresIn: "30d" });
}

function parseAuth(req) {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		try {
			req.jwt = jwt.verify(token, "notable-secret");
			return true;
		} catch (err) {
			console.error(err);
		}
	} else {
		console.log("no authorization header");
	}
}

function requiresLogin(req, res, next) {
	if (parseAuth(req)) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}
function requiresAdmin(req, res, next) {
	parseAuth(req);
	if (req.jwt?.isAdmin) {
		next();
	} else {
		console.log(req.jwt);
		res.status(401).send("Unauthorized");
	}
}

app.use(express.static("client/build"));
app.use(express.json());
app.use(
	"/api/*",
	cors({
		origin: [
			`http://localhost:${PORT}`,
			`https://stormy-plateau-24106.herokuapp.com`,
		],
	})
);

// Socket.io section

const io = new Server(3001, {
	cors: {
		origin: "http://localhost:3000",
		allowEIO3: true,
	},
});

let users = [];

io.on("connection", (socket) => {
	console.log("User Connected", socket.id);

	socket.on("join_room", (data) => {
		socket.join(data.room);
		console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
		let user = {
			room: data.room,
			name: data.name,
			id: socket.id,
		};
		users.push(user);
		console.log("All users: ", users);
	});

	socket.on("get_users", (room) => {
		let roomUsers = [];
		users.forEach(user => {
			if (user.room == room) {
				roomUsers.push(user);
			}
		});
		socket.emit("user_list", roomUsers);
	})

	socket.on("disconnect", () => {
		console.log("User Disconnected", socket.id);
	});
});

// API section

app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;
	const result = await pool.query(
		"SELECT * FROM users WHERE username = $1 AND password = $2",
		[username, password]
	);
	if (result.rows.length === 0) {
		console.log(result);
		console.log(req.body);
		res.status(403).send("Invalid username or password");
	} else {
		const token = generateAccessToken(username, result.rows[0].admin);
		res.json({
			token,
			user: {
				id: result.rows[0].id,
				username,
				isAdmin: result.rows[0].admin,
				name: result.rows[0].name,
			},
		});
	}
});

// save user notes from PDFnotes to db
app.post("/api/addNote", async (req, res) => {
	const { note, timestamp, pageNumber } = req.body;
//	const fullnote = note + " " + timestamp + " " + pageNumber;
	await pool.query("INSERT INTO notes (note, time_stamp, page_number) VALUES ($1, $2, $3)", [note, timestamp, pageNumber]);
	res.send("Note saved to database");
});

// get sets of notes from database
app.get("/api/get_noteSet", async (req, res) => {
	const {rows} = await pool.query("SELECT * FROM presentations");
	res.send(rows);
})

app.post("/api/register", async (req, res) => {
	const { username, password, name } = req.body;
	const result = await pool.query(
		"INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING *",
		[username, password, name]
	);
	if (result.rows.length === 0) {
		res.status(400).send("Username already exists");
	} else {
		const token = generateAccessToken(username, result.rows[0].admin);
		res.json({ token });
	}
});

app.post("/api/presentations", async (req, res) => {
	const {
		presentation_instance_id,
		title,
		scheduled_date,
		youtube_url,
		pdf,
		presenter_id,
	} = req.body;
	const result = await pool.query(
		"INSERT INTO presentations (presentation_instance_id, title, scheduled_date, youtube_url, pdf, presenter_id) VALUES ($1, $2, $3, $4, $5, $6)",
		[
			presentation_instance_id,
			title,
			scheduled_date,
			youtube_url,
			pdf,
			presenter_id,
		]
	);
	if (result.rows.length === 0) {
		// Duplicates should only be an issue if instance ID is not unique.
		res.status(400).send("Cannot schedule duplicate presentation.");
	} else {
		res.send("Presentation has been scheduled.");
	}
});

app.get("/api/users", requiresAdmin, async (req, res) => {
	const result = await pool.query(
		"SELECT id, username, name, admin FROM users"
	);
	res.json({ users: result.rows });
});
app.get("/api/user_info", requiresLogin, async (req, res) => {
	const result = await pool.query("SELECT * FROM users WHERE username = $1", [
		req.jwt.username,
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
app.put("/api/update_user", requiresAdmin, async (req, res) => {
	await pool.query(
		"UPDATE users SET name = $1, admin = $2 WHERE username = $3",
		[req.body.name, req.body.admin, req.body.username]
	);
	res.send("User updated");
});
app.delete("/api/delete_user", requiresAdmin, async (req, res) => {
	const result = await pool.query("DELETE FROM users WHERE username = $1", [
		req.query.username,
	]);
	if (result.rowCount) {
		res.send("User deleted");
	}
});

app.get("/*", (req, res) => {
	res.sendFile(`${__dirname}/client/build/index.html`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
