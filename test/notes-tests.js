import chai from "chai";
import chaiHttp from "chai-http";
// import pool from "../dbHelper.js";
import server from "../index.js";
import * as notesClass from "./notes-testing-constants.js";
import * as userClass from "./user-testing-constants.js";

chai.should();
chai.use(chaiHttp);

describe("notes", function () {
	it("should add a note ", function (done) {
		chai
			.request(server)
			.post("/api/login")
			.send(userClass.USER_1)
			.end(function (error, res) {
				res.should.have.status(200);
				res.body.should.have.property("token");
				var token = res.body.token;
				chai
					.request(server)
					.post("/api/addNote")
					.auth(token, { type: "bearer" })
					.send(notesClass.POST_NOTE_1)
					.end(function (error, res) {
						res.should.have.status(200);
						res.body.should.be.a("array");
						done();
					});
			});
	});
});
