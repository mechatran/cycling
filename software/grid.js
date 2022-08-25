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

class DataGrid extends Array {
  constructor (height, width) {
    super();
    for (let row = 0; row < height; ++row) {
      this[row] = [];
    }
    this.height = height;
    this.width = width;
  }

  static fromArray(a) {
    var newGrid = new DataGrid(a.length, a[0].length);
    for (let row = 0; row < newGrid.height; ++row) {
      newGrid[row] = Array.from(a[row]);
    }
    return newGrid;
  }

  static fromSimilarGrid (grid) {
    return new DataGrid(grid.height, grid.width);
  }
}

function calcGridFromRowAndColumnHeadings (rowHeadings, columnHeadings, callback) {
  var result = new DataGrid(rowHeadings.length, columnHeadings.length);
  for (let row = 0; row < result.height; ++row) {
    for (let column = 0; column < result.width; ++column) {
      result[row][column] = callback(rowHeadings[row], columnHeadings[column], row, column);
    }
  }
  return result;
}

function calcGridFromRowHeadingsAndGrid (rowHeadings, grid, callback) {
  var result = new DataGrid(grid.height, grid.width);
  for (let row = 0; row < result.height; ++row) {
    for (let column = 0; column < result.width; ++column) {
      result[row][column] = callback(rowHeadings[row], grid[row][column], row, column);
    }
  }
  return result;
}

function calcGridFromColumnHeadingsAndGrid (columnHeadings, grid, callback) {
  var result = new DataGrid(grid.height, grid.width);
  for (let row = 0; row < result.height; ++row) {
    for (let column = 0; column < result.width; ++column) {
      result[row][column] = callback(columnHeadings[column], grid[row][column], row, column);
    }
  }
  return result;
}

function calcGridFromGrids (gridArray, callback) {
  var result = new DataGrid(gridArray[0].height, gridArray[0].width);
  for (let row = 0; row < result.height; ++row) {
    for (let column = 0; column < result.width; ++column) {
      let slice = [];
      for (let layer = 0; layer < gridArray.length; ++layer) {
        slice[layer] = gridArray[layer][row][column];
      }
      result[row][column] = callback(...slice, row, column);
    }
  }
  return result;
}
