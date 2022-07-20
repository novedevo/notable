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
export function requiresAdmin(req, res, next) {
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
