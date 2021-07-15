const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test("Solve a puzzle with valid puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        assert.equal(res.body.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
        done();
      })
  })

  test("Solve a puzzle with missing puzzle string", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Required field missing"});
        done();
      })
  })

  test("Solve a puzzle with invalid characters", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: '82..4..6...16..89...98315.749.157.jif.........53..4...96.415..81..7632..3...28.51'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Invalid characters in puzzle"});
        done();
      })
  })

  test("Solve a puzzle with incorrect length", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: '82..4..6...16..89...98315.93218510952749.157.............53..4...96.415..81..7632..3...28.51'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Expected puzzle to be 81 characters long"});
        done();
      })
  })

  test("Solve a puzzle that cannot be solved", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: "................................................................................."})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Puzzle cannot be solved"});
        done();
      })
  })

  test("Check a puzzle placement with all fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "H3",
        value: "5"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.deepEqual(res.body, {valid: true});
        done();
      })
  })

  test("Check a puzzle placement with single placement conflict", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "H2",
        value: "5"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.lengthOf(res.body.conflict, 1);
        assert.deepEqual(res.body, {valid: false, conflict: ["column"]});
        done();
      })
  })

  test("Check a puzzle placement with multiple placement conflicts", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "E2",
        value: "7"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.lengthOf(res.body.conflict, 2);
        assert.deepEqual(res.body, {valid: false, conflict: ["column", "region"]});
        done();
      })
  })

  test("Check a puzzle placement with all placement conflicts", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "F2",
        value: "6"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.lengthOf(res.body.conflict, 3);
        assert.deepEqual(res.body, {valid: false, conflict: ["row", "column", "region"]});
        done();
      })
  })

  test("Check a puzzle placement with missing required fields", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "F2"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Required field(s) missing"});
        done();
      })
  })

  test("Check a puzzle placement with invalid characters:", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.eeee..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "F2",
        value: "4"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Invalid characters in puzzle"});
        done();
      })
  })

  test("Check a puzzle placement with incorrect length", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.....325346326..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "F2",
        value: "4"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Expected puzzle to be 81 characters long"});
        done();
      })
  })

  test("Check a puzzle placement with invalid placement coordinate", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "F69",
        value: "4"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Invalid coordinate"});
        done();
      })
  })

  test("Check a puzzle placement with invalid placement value", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        coordinate: "F6",
        value: "13"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
        assert.deepEqual(res.body, {error: "Invalid value"});
        done();
      })
  })
});

