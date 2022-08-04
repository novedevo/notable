import chai from "chai";
import chaiHttp from "chai-http";
import pool from "./dbHelper.js";
import server from "../index.js";
// import * as noteClass from "./notes-testing-constants.js";
import * as userClass from "./user-testing-constants.js";
// import * as presentationClass from "./presentations-testing-constants.js";

chai.should();
chai.use(chaiHttp);

describe("presentations", function () {
	before("insert test data", function () {
		try {
			pool.query(`INSERT INTO presentations (presentation_instance_id, title, scheduled_date, presentation_end_date, pdf, presenter_id) 
                VALUES (106, 'this should be deleted', '2022-07-30 10:00:00', null, 'fakepdf', 102)`);
		} catch (err) {
			console.log(err);
		}
	});

	it("should get all presentations that a user created or has notes in given the user id", function (done) {
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
					.get("/api/notePresentations/")
					.send({ id: 102 })
					.auth(token, { type: "bearer" })
					.end(function (error, res) {
						res.should.have.status(200);
						res.body.should.be.a("array");
						res.body.length.should.be.eql(4);
						done();
					});
			});
	});
	//TODO:
	after("delete test data", function () {
		try {
			pool.query(
				`DELETE FROM presentations WHERE presentation_instance_id = 106`
			);
		} catch (err) {
			console.log(err);
		}
	});
});
