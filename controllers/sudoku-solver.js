class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString === undefined || puzzleString === '') {
      return {error: "Required field missing"}
    }
    if (puzzleString.length !== 81) {
      return {error: "Expected puzzle to be 81 characters long"};
    }
    //check if puzzleString only contains [0-9] and [.]
    for (let i = 0; i <= puzzleString.length - 1; i++) {
      if(!/[0-9]/.test(puzzleString[i])) {
        if(!/\./.test(puzzleString[i])) {
          return {error: "Invalid characters in puzzle"}
        }
      }
    }

    return puzzleString;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //check required fields
    if (puzzleString === undefined || puzzleString === '' || row === undefined || row === '' || column === undefined || column === '' || value === undefined || value === '') {
      return {error: "Required field(s) missing"};
    }
    //validate puzzle string
    if (this.validate(puzzleString) !== puzzleString) {
      return this.validate(puzzleString);
    }
    //check if value is [1-9]
    if (!/^[0-9]$/.test(value)) {
      return {error: "Invalid value"}
    }
    //check if column is [1-9]
    if (!/^[0-9]$/.test(column)) {
      return {error: "Invalid coordinate"}
    }
    //split by row
    let splitByRow = []
    for (let i = 0; i <= puzzleString.length - 1; i++) {
      splitByRow.push(puzzleString.slice(i, i + 9))
      i = i + 8;
    }
    //translating row
    switch (row) {
      case "A":
        row = splitByRow[0]
        break;
      case "B":
        row = splitByRow[1]
        break;
      case "C":
        row = splitByRow[2]
        break;
      case "D":
        row = splitByRow[3]
        break;
      case "E":
        row = splitByRow[4]
        break;
      case "F":
        row = splitByRow[5]
        break;
      case "G":
        row = splitByRow[6]
        break;
      case "H":
        row = splitByRow[7]
        break;
      case "I":
        row = splitByRow[8]
        break;
      default:
        return {error: "Invalid coordinate"}
    }
    //valid or not
    if (row[column - 1] == value) {
      return {valid: true};
    }
    if (row.indexOf(value) !== -1) {
      return {valid: false, conflict: "row"}
    }

    return {valid: true}
  }

  checkColPlacement(puzzleString, row, column, value) {
    //check required fields
    if (puzzleString === undefined || puzzleString === '' || row === undefined || row === '' || column === undefined || column === '' || value === undefined || value === '') {
      return {error: "Required field(s) missing"};
    }
    //validate puzzle string
    if (this.validate(puzzleString) !== puzzleString) {
      return this.validate(puzzleString);
    }
    //check if value is [1-9]
    if (!/[0-9]/.test(value)) {
      return {error: "Invalid value"}
    }
    //check if column is [1-9]
    if (!/[0-9]/.test(column)) {
      return {error: "Invalid coordinate"}
    }
    //split by column
    let splitByColumn = []
    let columnHolder = []
    for (let i = 0; i <= 8; i++) {
      let k = 0 + i;
      for (let j = 0; j <= puzzleString.length - 1; j++) {
        columnHolder.push(puzzleString.slice(k, k + 1));
        k = k + 9
      }
      splitByColumn.push(columnHolder.join(""))
      columnHolder = []
    }
    //translating row
    switch (row) {
      case "A":
        row = 0
        break;
      case "B":
        row = 1
        break;
      case "C":
        row = 2
        break;
      case "D":
        row = 3
        break;
      case "E":
        row = 4
        break;
      case "F":
        row = 5
        break;
      case "G":
        row = 6
        break;
      case "H":
        row = 7
        break;
      case "I":
        row = 8
        break;
      default:
        return {error: "Invalid coordinate"}
    }
    //valid or not
    if (splitByColumn[column - 1][row] == value) {
      return {valid: true};
    }
    if (splitByColumn[column - 1].indexOf(value) !== -1) {
      return {valid: false, conflict: "column"}
    } 

    return {valid: true}
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //check required fields
    if (puzzleString === undefined || puzzleString === '' || row === undefined || row === '' || column === undefined || column === '' || value === undefined || value === '') {
      return {error: "Required field(s) missing"};
    }
    //validate puzzle string
    if (this.validate(puzzleString) !== puzzleString) {
      return this.validate(puzzleString);
    }
    //check if value is [1-9]
    if (!/[0-9]/.test(value)) {
      return {error: "Invalid value"}
    }
    //check if column is [1-9]
    if (!/[0-9]/.test(column)) {
      return {error: "Invalid coordinate"}
    }
    //check if row is [A-I]
    if (!/[A-I]/.test(row)) {
      return {error: "Invalid coordinate"}
    }
    //split by region
    let splitByRegion = []
    let regionHolder = []
    for(let l = 0; l <= puzzleString.length - 27; l += 27) {
      let k;
      for (let i = 0; i <= 8; i += 3) {
        k = l + i;
        for (let j = 0; j <= 2; j++) {
          regionHolder.push(puzzleString.slice(k, k + 3));
          k = k + 9
        }
        splitByRegion.push(regionHolder.join(""))
        regionHolder = [];
      }
    }
    //find region index
    function region(rowCoord, columnCoord) {

      function forRow(forRow) {
        if (forRow === "A" || forRow === "B" || forRow === "C") {
          return ["1", "2", "3"];
        } else if (forRow === "D" || forRow === "E" || forRow === "F") {
          return ["4", "5", "6"];
        } else if (forRow === "G" || forRow === "H" || forRow === "I") {
          return ["7", "8", "9"]
        }
      }

      function forColumn(forColumn) {
        if (forColumn == "1" || forColumn == "2" || forColumn == "3") {
          return ["1", "4", "7"]
        } else if (forColumn == "4" || forColumn == "5" || forColumn == "6") {
          return ["2", "5", "8"]
        } else if (forColumn == "7" || forColumn == "8" || forColumn == "9") {
          return ["3", "6", "9"]
        }
      }

      let regionRow = forRow(rowCoord);
      let regionColumn = forColumn(columnCoord);

      for (let i = 0; i <= regionRow.length - 1; i++) {
        if (regionColumn.indexOf(regionRow[i]) !== -1) {
          return regionRow[i]
        }
      }
    }
    let regionIndex = region(row, column);
    //translating row
    let rowIndex;
    if (row === "A" || row === "D" || row === "G") {
      rowIndex = 0;
    } else if (row === "B" || row === "E" || row === "H") {
      rowIndex = 3;
    } else if (row === "C" || row === "F" || row === "I") {
      rowIndex = 6;
    }
    //translating column
    let columnIndex;
    if (column == "1" || column == "4" || column == "7") {
      columnIndex = 0;
    } else if (column == "2" || column == "5" || column == "8") {
      columnIndex = 1;
    } else if (column == "3" || column == "6" || column == "9") {
      columnIndex = 2;
    }

    //valid or not
    if (splitByRegion[regionIndex - 1][rowIndex + columnIndex] == value) {
      return {valid: true};
    }
    if(splitByRegion[regionIndex - 1].indexOf(value) !== -1) {
      return {valid: false, conflict: "region"}
    }

    return {valid: true};
  }

  solve(puzzleString) {
    //validate puzzle string
    if (this.validate(puzzleString) !== puzzleString) {
      return this.validate(puzzleString);
    }

    //replace function
    function replaceAt(str, index, replacement) {
      let beforeIndex = str.substr(0, index);
      let afterIndex = str.substr(index + 1)
      return beforeIndex + replacement + afterIndex;
    }

    //solve logic
    let loopcount = 0;
    do {
      let chooseHere = [];
      let possibleAnswers = [];
      for(let i = 0; i <= puzzleString.length - 1; i++) {
        if (puzzleString[i] === '.') {
          let row = Math.floor(i / 9)
          switch(row) {
            case 0:
              row = "A";
              break;
            case 1:
              row = "B";
              break;
            case 2:
              row = "C";
              break;
            case 3:
              row = "D";
              break;
            case 4:
              row = "E";
              break;
            case 5:
              row = "F";
              break;
            case 6:
              row = "G";
              break;
            case 7:
              row = "H";
              break;
            case 8:
              row = "I";
              break;
          }
          let column = (i % 9) + 1;
  
          for (let j = 1; j <= 9; j++) {
            let checkRow = this.checkRowPlacement(puzzleString, row, column.toString(), j).valid;
            let checkCol = this.checkColPlacement(puzzleString, row, column.toString(), j).valid;
            let checkRegion = this.checkRegionPlacement(puzzleString, row, column.toString(), j).valid;
  
            if (checkRow && checkCol && checkRegion) {
              possibleAnswers.push(j);
            }
          }
          
          if (possibleAnswers.length === 1) {
            puzzleString = replaceAt(puzzleString, i, possibleAnswers[0]);
          }
  
          chooseHere.push(possibleAnswers);
          possibleAnswers = [];
        }
      }
      loopcount++;
      if (loopcount == 50) {
        return {error: "Puzzle cannot be solved"}
      }
    }
    while(puzzleString.indexOf(".") !== -1)
    
    return {solution: puzzleString};
  }
}

module.exports = SudokuSolver;

