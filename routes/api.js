'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      if (req.body.puzzle === undefined || req.body.coordinate === undefined || req.body.value === undefined || req.body.puzzle === "" || req.body.coordinate === "" || req.body.value === "") {
        return res.json({error: "Required field(s) missing"})
      }

      let checkRow = solver.checkRowPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)
      let checkCol = solver.checkColPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)
      let checkRegion = solver.checkRegionPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value)

      if (req.body.coordinate.length > 2) {
        return res.json({error: "Invalid coordinate"})
      }
      if (req.body.value < 1 || req.body.length > 9) {
        return res.json({error: "Invalid value"})
      }

      if (checkRow.valid === undefined) {
        return res.json(checkRow);
      } else if (checkCol.valid === undefined) {
        return res.json(checkCol);
      } else if (checkRegion.valid === undefined) {
        return res.json(checkRegion);
      }

      let conflict = {conflict: []}
      if (!checkRow.valid) {
        conflict.conflict.push("row")
      }
      if (!checkCol.valid) {
        conflict.conflict.push("column")
      }
      if (!checkRegion.valid) {
        conflict.conflict.push("region")
      }

      if (checkRow.valid && checkCol.valid && checkRegion.valid) {
        res.json({valid: true})
      } else {
        res.json({valid: false, conflict: conflict.conflict})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      res.json(solver.solve(req.body.puzzle))
    });
};
