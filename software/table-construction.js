//////////////////////////////////////////////////////////////////////////////
// Table construction
//////////////////////////////////////////////////////////////////////////////

function addInterleavedRows (table, tdMajor, tdMinor, width, dataGrids, formatters) {
  var tr;
  var td;
  var cellGrids = [];

  // Some grids may be undersized, so the width is usually specified.  If not
  // provided, calculate the maximum width of all the grids.
  if (!width) {
    width = 0;
    for (let k = 0; k < dataGrids.length; ++k) {
      for (let i = 0; i < dataGrids[k].length; ++i) {
        width = Math.max(width, dataGrids[k][i].length);
      }
    }
  }

  // tdMinor.length correlates with the height of the portion of each grid to
  // be shown.  If no minor labels, show everything.
  var height;
  if (tdMinor) {
    height = tdMinor.length;
  } else {
    height = 0;
    for (let k = 0; k < dataGrids.length; ++k) {
      height = Math.max(height, dataGrids[k].length);
    }
  }

  // Convert data to HTML DOM nodes
  for (let k = 0; k < dataGrids.length; ++k) {
    cellGrids[k] = [];
    for (let i = 0; i < height; ++i) {
      cellGrids[k][i] = [];
      for (let j = 0; j < width; ++j) {
        let content = dataGrids[k] && dataGrids[k][i] && dataGrids[k][i][j];
        if (content) {
          content = formatters[k](content);
          td = gStock.tdData.cloneNode();
          td.appendChild(document.createTextNode(content));
        } else {
          td = gStock.tdEmpty.cloneNode();
        }
        cellGrids[k][i][j] = td;
      }
    }
  }

  // Contruct the table rows
  for (let i = 0; i < height; ++i) {
    for (let k = 0; k < cellGrids.length; ++k) {
      tr = table.appendChild(gStock.trPlain.cloneNode())
      // Left-side annotations
      if (k == 0) {
        // Major label
        if (tdMajor && (i == 0)) {
          td = tr.appendChild(tdMajor);
          td.setAttribute("rowspan", dataGrids.length * height);
        }
        // Minor label
        if (tdMinor) {
          td = tr.appendChild(tdMinor[i]);
          td.setAttribute("rowspan", dataGrids.length);
        }
      }
      // Convert data to HTML
      for (let j = 0; j < width; ++j) {
        tr.appendChild(cellGrids[k][i][j]);
      }
    }
  }

  return cellGrids;
}

//////////////////////////////////////////////////////////////////////////////

function addRow (table, tdMajor, tdMinor, data, formatter) {
  var tr;
  var td;
  var cells = [];

  for (let i = 0; i < data.length; ++i) {
    let content = formatter(data[i]);
    td = gStock.tdData.cloneNode();
    td.appendChild(document.createTextNode(content));
    cells[i] = td;
  }

  tr = table.appendChild(gStock.trPlain.cloneNode());
  if (tdMajor) {
    tr.appendChild(tdMajor);
  }
  if (tdMinor) {
    tr.appendChild(tdMinor);
  }
  for (let i = 0; i < cells.length; ++i) {
    tr.appendChild(cells[i]);
  }

  return cells;
}

//////////////////////////////////////////////////////////////////////////////

function __mergeVertical (rows, width, column=0, rowStart=0, rowMax=rows.length) {
  if (column >= width) {
    return;
  }

  let start = rowStart;
  while (start < rowMax) {
    let end = start + 1;
    while ((end < rowMax) &&
      rows[start][column] &&
      rows[end][column] &&
      rows[start][column].isEqualNode(rows[end][column]))
    {
      ++end;
    }
    if (rows[start][column]) {
      let height = rows[start][column].getAttribute("rowspan");
      height = height ? parseInt(height) : 1;
      rows[start][column].setAttribute("rowspan", height + (end - start - 1));
      for (let i = start + 1; i < end; ++i) {
        rows[i][column] = undefined;
      }
    }
    __mergeVertical(rows, width, column + 1, start, end);
    start = end;
  }
}

// TODO: Update addInterleavedRows() to use __buildEvenCellGrid()?
function __buildEvenCellGrid (node, buildDataCell, resolvers, depth) {
  var rowsHeadings = [];
  var rowsData = [];
  var dataGrid = [];

  var [headings, children] = resolvers[depth](node);
  var widthHeadings;
  if (headings instanceof Array) {
    if (headings[0] instanceof Array) {
      // Allow trailing headings to be ignored (i.e. empty cells for spacing)
      [headings, widthHeadings] = headings;
    } else {
      widthHeadings = headings.length;
    }
  } else {
    headings = [headings];
    widthHeadings = 1;
  }

  if (depth == resolvers.length - 1) {
    let row = [];

    for (let i = 0; i < children.length; ++i) {
      let td;
      if (buildDataCell) {
        td = buildDataCell(i, children[i]);
      } else {
        td = children[i];
      }
      row.push(td);
    }

    rowsHeadings = [headings];
    rowsData = [row];
    dataGrid = [children];
  } else {
    let widthHeadingsChildren;
    for (let child of children) {
      let [rowsHeadingsChild, widthHeadingsChild, rowsDataChild, dataGridChild] =
        __buildEvenCellGrid(child, buildDataCell, resolvers, depth + 1);
      widthHeadingsChildren = widthHeadingsChild;
      rowsHeadings.push(...rowsHeadingsChild);
      rowsData.push(...rowsDataChild);
      dataGrid.push(...dataGridChild);
    }
    __mergeVertical(rowsHeadings, widthHeadingsChildren);

    for (let heading of headings) {
      if (heading instanceof HTMLElement) {
        // TODO: For HTML, we can increase the cell height directly.  For
        //       others (e.g. CSV), perhaps change this to invoke a callback
        //       function to do this?
        heading.setAttribute("rowspan", rowsHeadings.length);
      }
    }
    rowsHeadings[0].unshift(...headings);
    for (let i = 1; i < rowsHeadings.length; ++i) {
      for (let heading of headings) {
        rowsHeadings[i].unshift(undefined);
      }
    }
  }

  return [rowsHeadings, widthHeadings, rowsData, dataGrid];
}

function __correlateUnevenRowCells (grid, row) {
  var cells = [];
  for (let j = 0; j < grid[row].length; ++j) {
    let cell;
    for (let i = row; i >= 0; --i)  {
      if (grid[i][j]) {
        cell = grid[i][j];
        break;
      }
    }
    if (cell && !cell.classList.contains("empty")) {
      cells.push(cell);
    }
  }
  return cells;
}

function buildUnevenCellGrid (root, buildDataCell, resolvers) {
  var [rowsHeadings, widthHeadings, rowsData, dataGrid] =
    __buildEvenCellGrid(root, buildDataCell, resolvers, 0);

  // DIY tr:hover for uneven cell grids
  var rowsCohort = [];
  for (let i = 0; i < rowsHeadings.length; ++i) {
    rowsCohort.push(__correlateUnevenRowCells(rowsHeadings, i));
  }

  // Find related data rows indexes
  var rowsRelated = [];
  for (let i = 0; i < rowsCohort.length; ++i) {
    let last = rowsCohort[i].length - 1;

    let start;
    for (start = i - 1; start >= 0; --start) {
      if (!(rowsCohort[start][last] === rowsCohort[i][last])) {
        break;
      }
    }
    ++start;

    let end;
    for (end = i + 1; end < rowsCohort.length; ++end) {
      if (!(rowsCohort[end][last] === rowsCohort[i][last])) {
        break;
      }
    }
    --end;

    rowsRelated[i] = [];
    for (let k = start; k <= end; ++k) {
      if (k != i) {
        rowsRelated[i].push(k);
      }
    }
  }

  // Find data rows with the same values
  var rowsEqual = [];
  for (let i = 0; i < rowsData.length; ++i) {
    let reference = dataGrid[i].join();
    rowsEqual[i] = [];
    for (let k = 0; k < rowsData.length; ++k) {
      if (i != k) {
        if (reference == dataGrid[k].join()) {
          rowsEqual[i].push(k);
        }
      }
    }
  }

  // Remove empty grid positions
  for (let i = 0; i < rowsHeadings.length; ++i) {
    let j = 0;
    while (j < rowsHeadings[i].length) {
      if (rowsHeadings[i][j] == undefined) {
        rowsHeadings[i].splice(j, 1);
      } else {
        ++j;
      }
    }
  }

  return [rowsHeadings, rowsData, rowsCohort, rowsRelated, rowsEqual];
}
