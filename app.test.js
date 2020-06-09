const tap = require("tap");

require("dotenv").config({ path: "./.env.test" });

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;

const dbConnect = require("./db/connect");
const db = require("./db");

const app = require("./app");

const VALID_USER = {
    username: "username",
    password: "password",
};

const INVALID_USER = {
    username: "wrong-username",
    password: "wrong-password",
};

let token = null;

tap.test("Connect DB", { bail: true }, (t) => {
    return dbConnect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Connected to DB");
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`Can't connect to DB by URL: ${MONGODB_TEST_URL}`);
        });
});

tap.test("Clean users", { bail: true }, (t) => {
    return db.user.deleteMany().catch((err) => {
        console.error(err);
        throw new Error(`Can't remove users`);
    });
});

tap.test("Create a user", { bail: true }, (t) => {
    return db.user.create(VALID_USER).catch((err) => {
        console.error(err);
        throw new Error(`Can't create a user: ${JSON.stringify(VALID_USER)}`);
    });
});

tap.test("Should return a token for a valid user", { bail: true }, (t) => {
    chai.request(app)
        .post("/auth")
        .send(VALID_USER)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("accessToken");
            token = res.body.accessToken;
            t.end();
        });
});

tap.test("Should return 404 for an invalid user", { bail: true }, (t) => {
    chai.request(app)
        .post("/auth")
        .send(INVALID_USER)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            t.end();
        });
});

tap.test(
    "Should return 401 for a valid user but wrong password",
    { bail: true },
    (t) => {
        chai.request(app)
            .post("/auth")
            .send({
                username: VALID_USER.username,
                password: INVALID_USER.password,
            })
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
                t.end();
            });
    }
);

tap.test("Should return 403 without a token", (t) => {
    chai.request(app)
        .get("/restricted-area")
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(403);
            t.end();
        });
});

tap.test("Should return 401 with a wrong token", (t) => {
    chai.request(app)
        .get("/restricted-area")
        .set("x-access-token", "wrong-token")
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            t.end();
        });
});

tap.test("Should return 200 with a valid token", (t) => {
    chai.request(app)
        .get("/restricted-area")
        .set("x-access-token", token)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            t.end();
        });
});

tap.tearDown(() => {
    db.mongoose.disconnect();
});
