import chai from "chai";
import chaiHttp from "chai-http";
import pool from "./dbHelper.js";
import server from "../index.js";
import * as noteClass from "./notes-testing-constants.js";
import * as userClass from "./user-testing-constants.js";
import * as presentationClass from "./presentations-testing-constants.js";

chai.should();
chai.use(chaiHttp);
var numVisibleNotes = 3;

describe("adding notes & notes visibility", function () {
	before("insert test data", function () {
		for (var i = 0; i < numVisibleNotes; i++) {
			try {
				pool.query(`INSERT INTO notes (note, time_stamp, page_number, notetaker_id, presentation_id, visible)
	        VALUES('examplenote', 300, '1', 101, '105', true) RETURNING note_id`);
			} catch (err) {
				console.log(err);
			}
		}
	});

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
					.get("/api/publicNotes/" + presentationClass.PRESENTATION_4.id)
					.auth(token, { type: "bearer" })
					.send(presentationClass.PRESENTATION_4)
					.end(function (error, res) {
						res.should.have.status(200);
						res.body.should.be.a("array");
						res.body.length.should.be.eql(numVisibleNotes);
						done();
					});
			});
	});
	it("should change the all the notes' visibility to from true to false for the given user and presentation", function (done) {
		chai
			.request(server)
			.post("/api/login")
			.send(userClass.USER_2)
			.end(function (error, res) {
				res.should.have.status(200);
				res.body.should.have.property("token");
				var token = res.body.token;
				chai
					.request(server)
					.patch("/api/noteVisibility")
					.auth(token, { type: "bearer" })
					.send({ id: "102", visible: false })
					.end(function (error, res) {
						res.should.have.status(200);
						done();
					});
			});
	});
	it("should change the all the notes' visibility to from false to true for the given user and presentation", function (done) {
		chai
			.request(server)
			.post("/api/login")
			.send(userClass.USER_2)
			.end(function (error, res) {
				res.should.have.status(200);
				res.body.should.have.property("token");
				var token = res.body.token;
				chai
					.request(server)
					.patch("/api/noteVisibility")
					.auth(token, { type: "bearer" })
					.send({ id: "104", visible: true })
					.end(function (error, res) {
						res.should.have.status(200);
						done();
					});
			});
	});

	after("delete test data + set notes back to default", function (done) {
		for (var i = 0; i < numVisibleNotes; i++) {
			try {
				pool.query(`DELETE FROM notes WHERE note = 'examplenote'`);
			} catch (err) {
				console.log(err);
			}
		}
		pool.query(`UPDATE notes SET visible = true WHERE note_id = 102`);
		pool.query(`UPDATE notes SET visible = false WHERE note_id = 105`);
		done();
	});
});
