import chai from "chai";
import chaiHttp from "chai-http";
import pool from "./dbHelper.js";
import server from "../index.js";
import * as noteClass from "./notes-testing-constants.js";
import * as userClass from "./user-testing-constants.js";
import * as presentationClass from "./presentations-testing-constants.js";

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
					.send(noteClass.POST_NOTE_1)
					.end(function (error, res) {
						res.should.have.status(200);
						res.body.should.be.a("array");
						done();
						pool.query(
							`DELETE FROM notes WHERE note = 'This is a posted test note by user 101 for presntation 1'`
						);
					});
			});
	});

	it("should get the visible notes from a given presentation id", function (done) {
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
					.get("/api/publicNotes/" + presentationClass.PRESENTATION_1.id)
					.auth(token, { type: "bearer" })
					.send(presentationClass.PRESENTATION_1)
					.end(function (error, res) {
						res.should.have.status(200);
						res.body.should.be.a("array");
						// ... what do i do if there are no visible notes in this presentation
						res.body.length.should.be.eql(
							pool.query(
								`SELECT * FROM notes WHERE presentation_id = $1 AND visible = true`
							).rowCount
						);
						done();
					});
			});
	});
});
