const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {
  suite("Validator", () => {
    let validString = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
    let invalidString = solver.validate('1.5..2.84ee63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
    let invalidLength = solver.validate('1.5..2.84..63.12.7.2..2.3674.3.7.2..9.47...8..1..16....926914.37.')
  
    test("Logic handles a valid puzzle string of 81 characters", () => {
      assert.lengthOf(validString, 81);
      assert.isString(validString);
    })
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
      assert.deepEqual(invalidString, {error: "Invalid characters in puzzle"});
      assert.property(invalidString, 'error');
    })
    test("Logic handles a puzzle string that is not 81 characters in length", () => {
      assert.property(invalidLength, "error");
      assert.deepEqual(invalidLength, {error: "Expected puzzle to be 81 characters long"});
    })
  })

  suite("Row checker", () => {
    let validRow = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', "F", "5", "2")
    let invalidRow = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', "A", "5", "2")

    test("Logic handles a valid row placement", () => {
      assert.property(validRow, "valid");
      assert.deepEqual(validRow, {valid: true});
    })
    test("Logic handles an invalid row placement", () => {
      assert.property(invalidRow, "valid");
      assert.property(invalidRow, "conflict");
      assert.deepEqual(invalidRow, {valid: false, conflict: "row"});
    })
  })

  suite("Column checker", () => {
    let validColumn = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', "F", "4", "5")
    let invalidColumn = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', "D", "1", "8")

    test("Logic handles a valid column placement", () => {
      assert.property(validColumn, "valid");
      assert.deepEqual(validColumn, {valid: true});
    })
    test("Logic handles an invalid column placement", () => {
      assert.property(invalidColumn, "valid");
      assert.property(invalidColumn, "conflict");
      assert.deepEqual(invalidColumn, {valid: false, conflict: "column"});
    })
  })

  suite("Region checker", () => {
    let validRegion = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', "H", "2", "3")
    let invalidRegion = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', "H", "2", "7")

    test("Logic handles a valid region (3x3 grid) placement", () => {
      assert.property(validRegion, "valid");
      assert.deepEqual(validRegion, {valid: true});
    })
    test("Logic handles an invalid region (3x3 grid) placement", () => {
      assert.property(invalidRegion, "valid");
      assert.property(invalidRegion, "conflict");
      assert.deepEqual(invalidRegion, {valid: false, conflict: "region"});
    })
  })

  suite("Solver checker", () => {
    let validPuzzleString = solver.solve("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
    let invalidPuzzleString = solver.solve(".................................................................................");

    test("Valid puzzle strings pass the solver", () => {
      assert.property(validPuzzleString, "solution");
      assert.isString(validPuzzleString.solution);
    })
    test("Invalid puzzle strings fail the solver", () => {
      assert.property(invalidPuzzleString, "error");
      assert.deepEqual(invalidPuzzleString, {error: "Puzzle cannot be solved"});
    })
    test("Solver returns the expected solution for an incomplete puzzle", () => {
      assert.property(validPuzzleString, "solution");
      assert.equal(validPuzzleString.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    })
  })


  



});
