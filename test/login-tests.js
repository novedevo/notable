import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js";
import * as userClass from "./user-constants.js";
var should = chai.should();

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
