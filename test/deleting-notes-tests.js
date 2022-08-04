import chai from "chai";
import chaiHttp from "chai-http";
import pool from "./dbHelper.js";
import server from "../index.js";
// import * as noteClass from "./notes-testing-constants.js";
import * as userClass from "./user-testing-constants.js";
import * as presentationClass from "./presentations-testing-constants.js";

chai.should();
chai.use(chaiHttp);

describe("deleting notes & presentations", function () {
	before("insert test data", function () {
		for (var i = 0; i < 3; i++) {
			try {
				pool.query(`INSERT INTO notes (note, time_stamp, page_number, notetaker_id, presentation_id, visible)
	        VALUES('throwawaynote ' || {$i}, 400, '1', 101, '102', false)`);
			} catch (err) {
				console.log(err);
			}
		}
		try {
			pool.query(`INSERT INTO presentations (presentation_instance_id, title, scheduled_date, presentation_end_date, pdf, presenter_id) 
                VALUES (106, 'this should be deleted', '2022-07-30 10:00:00', null, 'fakepdf', 2)`);
			pool.query(`INSERT INTO notes (note_id, note, time_stamp, page_number, notetaker_id, presentation_id, visible)
	        VALUES(107, 'delete this single note', 400, '1', 102, '104', true)`);
		} catch (err) {
			console.log(err);
		}
	});

	it("should delete all notes from the logged in user for a given presentation", function (done) {
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
					.delete(
						"/api/presentationNotes/" + presentationClass.PRESENTATION_1.id
					)
					.auth(token, { type: "bearer" })
					.end(function (error, res) {
						res.should.have.status(200);
						res.text.should.eql("Presentation Notes has been deleted.");
						done();
					});
			});
	});
	it("should delete a presentation given the presentation id", function (done) {
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
					.delete("/api/presentation/" + 106)
					.auth(token, { type: "bearer" })
					.end(function (error, res) {
						res.should.have.status(200);
						res.text.should.eql("Presentation has been deleted.");
						done();
					});
			});
	});
	it("should delete a note given the note id", function (done) {
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
					.delete("/api/note/" + 107)
					.auth(token, { type: "bearer" })
					.end(function (error, res) {
						res.should.have.status(200);
						res.text.should.eql("Note has been deleted.");
						done();
					});
			});
	});
});
