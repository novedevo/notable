import chai from "chai";
import chaiHttp from "chai-http";
import pool from "./dbHelper.js";
import server from "../index.js";
import * as userClass from "./user-testing-constants.js";

chai.should();
chai.use(chaiHttp);

describe("logins", function () {
	it("should sucessfully log in given correct user info", function (done) {
		chai
			.request(server)
			.post("/api/login")
			.send(userClass.USER_1)
			.end(function (error, res) {
				res.should.have.status(200);
				res.body.should.have.property("token");
				res.body.should.have.property("user").eql({
					id: 101,
					username: userClass.USER_1.username,
					isAdmin: false,
					name: "Jim",
				});
				done();
			});
	});

	it("should not log in given incorrrect user info", function (done) {
		chai
			.request(server)
			.post("/api/login")
			.send(userClass.BAD_USER_1)
			.end(function (error, res) {
				res.should.have.status(403);
				res.body.should.be.empty;
				res.text.should.eql("Invalid username or password");
				done();
			});
	});
});

describe("registering users", function () {
	it("should successfully register user given username is unique", function (done) {
		chai
			.request(server)
			.post("/api/register")
			.send(userClass.NEW_USER_2)
			.end(function (error, res) {
				res.should.have.status(200);
				res.body.should.have.property("token");
				done();
			});
	});
	it("should not register user given username already exists", function (done) {
		chai
			.request(server)
			.post("/api/register")
			.send(userClass.EXISTING_USERNAME_1)
			.end(function (error, res) {
				res.should.have.status(400);
				res.text.should.eql("Username already exists");
				done();
			});
	});
	after(function (done) {
		pool.query(`DELETE FROM users WHERE username = 'newtestuser'`);
		console.log("deleted jolyne!!");
		done();
	});
});
