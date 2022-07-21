import jwt from "jsonwebtoken";

export function generateAccessToken(username, isAdmin) {
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

export async function getUserId(username, pool) {
	const result = await pool.query("SELECT id FROM users WHERE username = $1", [
		username,
	]);
	return result.rows[0].id;
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
