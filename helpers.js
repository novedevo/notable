import express from "express";
import fileupload from "express-fileupload";
import jwt from "jsonwebtoken";

export function sql(strings) {
	return strings[0];
}

export function addPresentationManagementRoutes(app, pool) {
	app.delete("/api/presentation/:id", requiresLogin, async (req, res) => {
		const { id } = req.params;
		await pool.query(
			sql`DELETE FROM presentations WHERE presentation_instance_id = $1`,
			[parseInt(id)]
		);
		res.send("Presentation has been deleted.");
	});
	app.get("/api/presentation/:id", async (req, res) => {
		const { id } = req.params;
		const result = await pool.query(
			sql`SELECT * FROM presentations WHERE presentation_instance_id = $1`,
			[id]
		);
		const notes = await pool.query(
			sql`SELECT * FROM notes WHERE presentation_id = $1 ORDER BY time_stamp ASC`,
			[id]
		);
		if (result.rows.length === 0) {
			res.status(404).send("Presentation does not exist.");
		}
		res.send({ ...result.rows[0], notes: notes.rows });
	});
	app.get("/api/presentations", requiresLogin, async (req, res) => {
		const result = await pool.query(sql`SELECT * FROM presentations`);
		res.json(result.rows);
	});
	app.get("/api/currentPresentations", requiresLogin, async (req, res) => {
		const result = await pool.query(
			sql`SELECT * FROM presentations WHERE presentation_end_date IS NULL`
		);
		res.json(result.rows);
	});

	app.post(
		"/api/presentation",
		requiresLogin,
		express.urlencoded({ extended: false }),
		fileupload(),
		async (req, res) => {
			const { title, scheduled_date, youtube_url } = req.body;
			const pdf = req.files?.pdf?.data?.toString?.("base64");
			if (!(pdf || youtube_url)) {
				res.status(400).send("Either pdf or youtube link must be specified");
				return;
			}
			if (!title || !scheduled_date) {
				res.status(400).send("All fields must be specified");
				return;
			}
			try {
				const result = await pool.query(
					sql`INSERT INTO presentations (title, scheduled_date, youtube_url, pdf, presenter_id) VALUES ($1, $2, $3, $4, $5)`,
					[title, scheduled_date, youtube_url, pdf, req.jwt.id]
				);

				if (result.rowCount === 0) {
					// Duplicates should only be an issue if instance ID is not unique.
					res.status(400).send("Cannot schedule duplicate presentation.");
				} else {
					res.send("Presentation has been scheduled.");
				}
			} catch (err) {
				res.status(500).send("Postgres error");
			}
		}
	);
	app.put(
		"/api/presentation",
		requiresLogin,
		express.urlencoded({ extended: false }),
		fileupload(),
		async (req, res) => {
			const { presentation_instance_id, title, scheduled_date, youtube_url } =
				req.body;
			const pdf = req.files?.pdf?.data?.toString?.("base64");
			if (!(pdf || youtube_url)) {
				res.status(400).send("Either pdf or youtube link must be specified");
				return;
			}
			if (!title || !scheduled_date) {
				res.status(400).send("All fields must be specified");
				return;
			}
			await pool.query(
				sql`UPDATE presentations SET title = $1, scheduled_date = $2, youtube_url = $3, pdf = $4 WHERE presentation_instance_id = $5`,
				[
					title,
					scheduled_date,
					youtube_url,
					pdf,
					parseInt(presentation_instance_id),
				]
			);
			res.send("Presentation has been updated.");
		}
	);
	app.post("/api/endPresentation/:id", requiresLogin, async (req, res) => {
		const { id } = req.params;
		await pool.query(
			sql`UPDATE presentations SET presentation_end_date = $1 WHERE presentation_instance_id = $2`,
			[new Date(), parseInt(id)]
		);
		res.send("Presentation has been ended.");
	});
}
export function generateAccessToken(id, isAdmin) {
	const payload = {
		id,
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

export function requiresLogin(req, res, next) {
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

export function addAdminRoutes(app, pool) {
	app.get("/api/users", requiresAdmin, async (req, res) => {
		const result = await pool.query(
			"SELECT id, username, name, admin FROM users"
		);
		res.json({ users: result.rows });
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
	app.delete("/api/user/:id", requiresAdmin, async (req, res) => {
		const { id } = req.params;
		if (!id) {
			res.status(400).send("Missing id");
		}
		await pool.query("DELETE FROM notes WHERE notetaker_id = $1", [
			req.params.id,
		]);
		const result = await pool.query("DELETE FROM users WHERE id = $1", [
			req.params.id,
		]);
		if (result.rowCount) {
			res.send("User deleted");
		}
	});
}
