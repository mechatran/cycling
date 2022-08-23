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
  for (let rowIndex = 0; rowIndex < rowHeadings.length; ++rowIndex) {
    result[rowIndex] = [];
    for (let columnIndex = 0; columnIndex < columnHeadings.length; ++columnIndex) {
      result[rowIndex][columnIndex] = callback(rowHeadings[rowIndex], columnHeadings[columnIndex], rowIndex, columnIndex);
    }
  }
  return result;
}

function calcGridFromRowHeadingsAndGrid (rowHeadings, grid, callback) {
  var result = [];
  for (let rowIndex = 0; rowIndex < grid.length; ++rowIndex) {
    result[rowIndex] = [];
    for (let columnIndex = 0; columnIndex < grid[rowIndex].length; ++columnIndex) {
      result[rowIndex][columnIndex] = callback(rowHeadings[rowIndex], grid[rowIndex][columnIndex], rowIndex, columnIndex);
    }
  }
  return result;
}

function calcGridFromColumnHeadingsAndGrid (columnHeadings, grid, callback) {
  var result = [];
  for (let rowIndex = 0; rowIndex < grid.length; ++rowIndex) {
    result[rowIndex] = [];
    for (let columnIndex = 0; columnIndex < grid[rowIndex].length; ++columnIndex) {
      result[rowIndex][columnIndex] = callback(columnHeadings[columnIndex], grid[rowIndex][columnIndex], rowIndex, columnIndex);
    }
  }
  return result;
}

function calcGridFromGrids (gridArray, callback) {
  var result = [];
  for (let rowIndex = 0; rowIndex < gridArray[0].length; ++rowIndex) {
    result[rowIndex] = [];
    for (let columnIndex = 0; columnIndex < gridArray[0][rowIndex].length; ++columnIndex) {
      let v = [];
      for (let gridIndex = 0; gridIndex < gridArray.length; ++gridIndex) {
        v[gridIndex] = gridArray[gridIndex][rowIndex][columnIndex];
      }
      result[rowIndex][columnIndex] = callback(...v, rowIndex, columnIndex);
    }
  }
  return result;
}
