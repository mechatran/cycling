//////////////////////////////////////////////////////////////////////////////
// Table formatting
//////////////////////////////////////////////////////////////////////////////

function __formatCellsOutsideBorder (cells, classSingle, classStart, classMiddle, classEnd) {
  if (cells instanceof Array) {
    if (cells.length == 1) {
      cells[0].classList.add(classSingle);
    } else {
      for (let i = 0; i < cells.length; ++i) {
        if (i == 0) {
          cells[i].classList.add(classStart);
        } else if (i == cells.length - 1) {
          cells[i].classList.add(classEnd);
        } else {
          cells[i].classList.add(classMiddle);
        }
      }
    }
  } else {
    cells.classList.add(classSingle);
  }
  return cells;
}

function formatLabelCellsVertical (cells) {
  return __formatCellsOutsideBorder(cells,
    "label-single",
    "label-top",
    "label-middle",
    "label-bottom");
}

function formatLabelCellsHorizontal (cells) {
  return __formatCellsOutsideBorder(cells,
    "label-single",
    "label-left",
    "label-center",
    "label-right");
}

function formatDataCellsVertical (cells) {
  return __formatCellsOutsideBorder(cells,
    "data-single",
    "data-top",
    "data-middle",
    "data-bottom");
}

function formatDataCellsHorizontal (cells) {
  return __formatCellsOutsideBorder(cells,
    "data-single",
    "data-left",
    "data-center",
    "data-right");
}

function formatCellGridGroups (dataGrids) {
  var combined = squishDown(dataGrids);
  for (let i = 0; i < combined.length; ++i) {
    for (let j = 0; j < combined[i].length; ++j) {
      formatDataCellsVertical(combined[i][j]);
    }
  }
}

function formatCellGridsGroupsConditionally (dataGrids, predicateGrid) {
  var combined = squishDown(dataGrids);
  for (let i = 0; i < combined.length; ++i) {
    for (let j = 0; j < combined[i].length; ++j) {
      if (predicateGrid.hasOwnProperty(i) &&
        predicateGrid[i].hasOwnProperty(j))
      {
        formatDataCellsVertical(combined[i][j]);
      }
    }
  }
}
