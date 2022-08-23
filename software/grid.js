//////////////////////////////////////////////////////////////////////////////
// Data grid utils
//////////////////////////////////////////////////////////////////////////////

function squishDown (grids) {
  let combined = [];
  for (let k = 0; k < grids.length; ++k) {
    for (let i = 0; i < grids[k].length; ++i) {
      if (!combined.hasOwnProperty(i)) {
        combined[i] = [];
      }
      for (let j = 0; j < grids[k][i].length; ++j) {
        if (!combined[i].hasOwnProperty(j)) {
          combined[i][j] = [];
        }
        combined[i][j].push(grids[k][i][j]);
      }
    }
  }
  return combined;
}

function zipFlatten (firstGrid, secondGrid) {
  let combined = [];
  for (let i = 0; i < firstGrid.length; ++i) {
    for (let j = 0; j < firstGrid[i].length; ++j) {
      combined.push([firstGrid[i][j], secondGrid[i][j]]);
    }
  }
  return combined;
}

function unzip (combined) {
  var a = [];
  var b = [];
  for (let i = 0; i < combined.length; ++i) {
    a.push(combined[i][0]);
    b.push(combined[i][1]);
  }
  return [a, b];
}

function clumpRelatedCells (grid, qualifier) {
  let related = [];
  for (let row of grid) {
    let rowRuns = [];
    let run = [];
    // Scan the row
    for (let i = 0; i < row.length; ) {
      if (qualifier(row[i], run)) {
        // This cell is part of the current run
        run.push(row[i]);
        ++i;
      } else if (run.length) {
        // Finish this (non-empty) run
        if (run.length) {
          rowRuns.push(run);
        }
        // Start a new run (and process this cell again)
        run = [];
      } else {
        // Ignore this non-qualifying cell
        ++i;
      }
    }
    // Finish the last (non-empty) run
    if (run.length) {
      rowRuns.push(run);
    }
    // Add only non-empty rows
    if (rowRuns.length) {
      related.push(rowRuns);
    }
  }
  return related;
}

function createRangeArray (start, end, step=1) {
  var result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

function calcGridFromRowAndColumnHeadings (rowHeadings, columnHeadings, callback) {
  var result = [];
  for (let rowIndex in rowHeadings) {
    result[rowIndex] = [];
    for (let columnIndex in columnHeadings) {
      result[rowIndex][columnIndex] = callback(rowHeadings[rowIndex], columnHeadings[columnIndex]);
    }
  }
  return result;
}

function calcGridFromRowHeadingsAndGrid (rowHeadings, grid, callback) {
  var result = [];
  for (let rowIndex in grid) {
    result[rowIndex] = [];
    for (let columnIndex in grid[rowIndex]) {
      result[rowIndex][columnIndex] = callback(rowHeadings[rowIndex], grid[rowIndex][columnIndex]);
    }
  }
  return result;
}

function calcGridFromColumnHeadingsAndGrid (columnHeadings, grid, callback) {
  var result = [];
  for (let rowIndex in grid) {
    result[rowIndex] = [];
    for (let columnIndex in grid[rowIndex]) {
      result[rowIndex][columnIndex] = callback(columnHeadings[columnIndex], grid[rowIndex][columnIndex]);
    }
  }
  return result;
}

function calcGridFromGrids (gridArray, callback) {
  var result = [];
  for (let rowIndex in gridArray[0]) {
    result[rowIndex] = [];
    for (let columnIndex in gridArray[0][rowIndex]) {
      let v = [];
      for (let gridIndex in gridArray) {
        v[gridIndex] = gridArray[gridIndex][rowIndex][columnIndex];
      }
      result[rowIndex][columnIndex] = callback(...v);
    }
  }
  return result;
}
