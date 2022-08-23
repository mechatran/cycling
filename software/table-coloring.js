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
      // TODO: Don't use gSwitches
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
