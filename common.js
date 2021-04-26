//////////////////////////////////////////////////////////////////////////////
// Numeric formatting
//////////////////////////////////////////////////////////////////////////////

function __formatRoundedTo (n, places) {
  if (n === undefined) {
    return "";
  } else {
    return n.toFixed(places);
  }
}

function __appendUnits (n, enabled, units) {
  if (enabled) {
    n += units;
  }
  return n;
}

function formatNone (n, units=true) {
  return n;
}

function formatCogTeeth (teeth, units=true) {
  return __appendUnits(teeth, units, " T");
}

function formatRatio (ratio, units=true) {
  return __formatRoundedTo(ratio, 2);
}

function formatGearInches (inches, units=true) {
  return __appendUnits(__formatRoundedTo(inches, 1), units,  '"');
}

function formatPower (power, units=true) {
  return __appendUnits(__formatRoundedTo(power, 0), units, " W");
}

function formatForce (force, units=true) {
  return __appendUnits(__formatRoundedTo(force, 0), units, " lbf");
}

function formatSpeed (speed, units=true) {
  return __appendUnits(__formatRoundedTo(speed, 1), units, " MPH");
}

function formatCadence (cadence, units=true) {
  return __appendUnits(__formatRoundedTo(cadence, 0), units, " RPM");
}

function formatTorque (torque, units=true) {
  return __appendUnits(__formatRoundedTo(torque, 0), units, " lb-ft");
}

function formatLengthMm (length, units=true) {
  return __appendUnits(__formatRoundedTo(length, 0), units, " mm");
}

function formatWeightLb (weight, units=true) {
  return __appendUnits(__formatRoundedTo(weight, 0), units, " lb");
}

function formatWeightKg (weight, units=true) {
  return __appendUnits(__formatRoundedTo(weight, 0), units, " kg");
}

function formatPercent (p, units=true) {
  return __appendUnits(__formatRoundedTo(p, 1), units, "%");
}

function formatFitness (fitness, units=true) {
  return __appendUnits(__formatRoundedTo(fitness, 1), units, " W/kg");
}

//////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////

function roundTo (n, places) {
  var factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
}

//////////////////////////////////////////////////////////////////////////////
// Unit conversions
//////////////////////////////////////////////////////////////////////////////

function convertLbToKg (weight) {
  return weight / 2.2;
}

function convertMmToIn (length) {
  return length / 25.4;
}

function convertMmToMi (length) {
  return convertMmToIn(length) / 12 / 5280;
}

function convertCircToRadius (length) {
  return length / Math.PI / 2;
}

//////////////////////////////////////////////////////////////////////////////
// Data grid utils
//////////////////////////////////////////////////////////////////////////////

function lookup (refValue, refTable, valueTable) {
  for (let i = 0; i < refTable.length; ++i) {
    for (let j = 0; j < refTable[i].length; ++j) {
      // NOTE: Strict equality check
      if (refTable[i][j] === refValue) {
        return valueTable[i][j];
      }
    }
  }
}

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

//////////////////////////////////////////////////////////////////////////////
// HTML DOM
//////////////////////////////////////////////////////////////////////////////

function purgeChildren (node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

function cloneNodeArray (a) {
  var b = []
  for (let i = 0; i < a.length; ++i) {
    b[i] = a[i].cloneNode(true)
  }
  return b
}

//////////////////////////////////////////////////////////////////////////////
// Table coloring
//////////////////////////////////////////////////////////////////////////////

function __calcColorFromClassNames (propertyName, classNames) {
  if (__calcColorFromClassNames.cache === undefined) {
    __calcColorFromClassNames.cache = {};
  }
  var cache = __calcColorFromClassNames.cache;
  if (cache[propertyName] === undefined) {
    cache[propertyName] = {};
  }
  cache = cache[propertyName];

  var colors = [];
  for (let i = 0; i < classNames.length; ++i) {
    if (cache[classNames[i]] === undefined) {
      var scratchDiv;
      if (scratchDiv === undefined) {
        scratchDiv = document.getElementById("scratch-div");
      }

      let td = scratchDiv.appendChild(gStock.tdPlain.cloneNode());
      td.classList.add(classNames[i]);
      cache[classNames[i]] = tinycolor(window.getComputedStyle(td).getPropertyValue(propertyName));
      td.classList.remove(classNames[i]);
      td.remove();
    }
    colors[i] = cache[classNames[i]];
  }
  return colors;
}

function colorGradient50Percentile (cellGrids, dataGrid, classNames) {
  var combined = zipFlatten(dataGrid, squishDown(cellGrids));
  combined.sort((a, b) => a[0] - b[0]);
  var [data, cells] = unzip(combined);

  // NOTE: Assume classNames.length == 3
  var limits = [0, Math.floor(cells.length / 2), cells.length - 1];
  var colors = __calcColorFromClassNames("background-color", classNames);

  var k = -1;
  var colorClass;
  var colorStart, colorEnd;
  var limitStart, limitEnd;
  for (let i = 0; i < cells.length; ++i) {
    // NOTE: If limits is set up well, k + 1 will never index past limits.length
    if (i == limits[k + 1]) {
      ++k;
      colorClass = classNames[k];
      colorStart = colors[k];
      colorEnd = colors[k + 1];
      limitStart = limits[k];
      limitEnd = limits[k + 1];
    }
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add(colorClass);
      if (gSwitches.blending.value) {
        // NOTE: Guarding against colorEnd === undefined also avoids doing math
        //       when limitEnd === undefined (i.e. k + 1 >= limits.length
        //       in the block above)
        if (colorEnd) {
          cells[i][j].style.backgroundColor =
            tinycolor.mix(
              colorStart,
              colorEnd,
              (i - limitStart) / (limitEnd - limitStart) * 100);
        }
      }
    }
  }
}

function colorGradient (cellGrids, dataGrid, spillOver, limitsAndClassNames) {
  var [limits, classNames] = unzip(limitsAndClassNames);

  var combined = zipFlatten(dataGrid, squishDown(cellGrids));
  combined.sort((a, b) => a[0] - b[0]);
  var [data, cells] = unzip(combined);

  var colors = __calcColorFromClassNames("background-color", classNames);

  for (let i = 0; i < data.length; ++i) {
    let colorClass;
    let colorStart, colorEnd;
    let limitStart, limitEnd;
    if (data[i] < limits[0]) {
      if (spillOver) {
        colorClass = classNames[0];
      } else {
        continue;
      }
    } else if (data[i] > limits[limits.length - 1]) {
      if (spillOver) {
        colorClass = classNames[classNames.length - 1];
      } else {
        continue;
      }
    } else {
      // NOTE: Assume limits.length >= 2
      for (let j = 0; j < limits.length - 1; ++j) {
        if (limits[j] <= data[i]) {
          if (data[i] < limits[j + 1]) {
            colorClass = classNames[j];
            colorStart = colors[j];
            colorEnd = colors[j + 1];
            limitStart = limits[j];
            limitEnd = limits[j + 1];
            break;
          }
        }
      }
      if (data[i] == limits[limits.length - 1]) {
        colorClass = classNames[classNames.length - 1];
      }
    }
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add(colorClass);
      if (gSwitches.blending.value) {
        if (colorEnd && colorStart) {
          cells[i][j].style.backgroundColor =
            tinycolor.mix(
              colorStart,
              colorEnd,
              (data[i] - limitStart) / (limitEnd - limitStart) * 100);
        }
      }
    }
  }
}

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

//////////////////////////////////////////////////////////////////////////////
// Table construction
//////////////////////////////////////////////////////////////////////////////

function addInterleavedRows (table, tdMajor, tdMinor, width, dataGrids, formatter) {
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
          content = formatter[k](content);
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

