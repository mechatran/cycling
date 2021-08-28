var gStock = {
  tableCogs: document.createElement("table"),
  trPlain: document.createElement("tr"),
  trSpacer: document.createElement("tr"),
  tdPlain: document.createElement("td"),
  tdData: document.createElement("td"),
  tdHeading: document.createElement("td"),
  tdHeadingRatio: document.createElement("td"),
  tdInfo: document.createElement("td"),
  tdSpacer: document.createElement("td"),
}
gStock.tableCogs.className = "cogs";
gStock.tdData.className = "data";
gStock.tdHeading.className = "heading";
gStock.tdHeadingRatio.className = "heading-ratio";
gStock.tdInfo.className = "info";
gStock.tdSpacer.className = "spacer";
gStock.trSpacer.appendChild(gStock.tdSpacer.cloneNode());

var gCogsData = new Map();

function calcCogsData (cogsDatabase) {
  for (let group of cogsDatabase) {
    for (let info of group.infos) {
      let min = Math.min(...info.sprockets);
      let max = Math.max(...info.sprockets);
      let data = [];
      data.push(formatCogInfoSize(info));
      data.push(max - min);
      gCogsData.set(info.sprockets, data);
    }
  }
}

function buildTdDataCell (text) {
  var td = gStock.tdData.cloneNode();
  if (text) {
    td.appendChild(document.createTextNode(text));
  }
  return td;
}

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

function handleHoverEnter (eventInfo, cohortNodes, relatedNodes, equalNodes) {
  for (let node of cohortNodes) {
    node.classList.add("hover");
  }
  for (let node of relatedNodes) {
    node.classList.add("hover-related");
  }
  for (let node of equalNodes) {
    node.classList.add("hover-equal");
  }
  eventInfo.stopPropagation();
}

function handleHoverLeave (eventInfo, cohortNodes, relatedNodes, equalNodes) {
  for (let node of cohortNodes) {
    node.classList.remove("hover");
  }
  for (let node of relatedNodes) {
    node.classList.remove("hover-related");
  }
  for (let node of equalNodes) {
    node.classList.remove("hover-equal");
  }
  eventInfo.stopPropagation();
}

function buildHover (node, cohortNodes, relatedNodes, equalNodes) {
  node.addEventListener("mouseover", (x) => handleHoverEnter(x, cohortNodes, relatedNodes, equalNodes));
  node.addEventListener("mouseout", (x) => handleHoverLeave(x, cohortNodes, relatedNodes, equalNodes));
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

function applyCellGridMergedHorizontal (grid, qualifier, formatter) {
  for (let i = 0; i < grid.length; ++i) {
    let j = 0;
    while (j < grid[i].length) {
      if (qualifier(grid[i][j])) {
        let cells = [grid[i][j]];
        for (++j; j < grid[i].length; ++j) {
          if (qualifier(grid[i][j]) && grid[i][j].childNodes.length == 0) {
            cells.push(grid[i][j]);
          } else {
            break;
          }
        }
        formatter(cells);
      } else {
        ++j;
      }
    }
  }
}

function buildCogsTable (parentId, cogsDatabase, formatCogsGroup, includeRange, useIndexParityColor) {
  var table;

  table = gStock.tableCogs.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  for (let groupIndex = 0; groupIndex < cogsDatabase.length; ++groupIndex) {
    if (groupIndex > 0) {
      table.appendChild(gStock.trSpacer.cloneNode(true));
    }

    let trMinor = table.appendChild(gStock.trPlain.cloneNode());
    trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Group"));
    trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Manufacturer"));
    trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Model"));
    if (groupIndex > 0) {
      trMinor.appendChild(gStock.tdSpacer.cloneNode());
      if (includeRange) {
        trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Range"));
      }
      trMinor.appendChild(gStock.tdHeadingRatio.cloneNode()).innerHTML = "&Delta;";
    }
    trMinor.appendChild(gStock.tdSpacer.cloneNode());
    let indexHeadings = [];
    for (let j = cogsDatabase[groupIndex].group; j > 0; --j) {
      let td = gStock.tdPlain.cloneNode();
      indexHeadings.push(td);
      if (!useIndexParityColor || (j % 2 == 0)) {
        td.classList.add("index-even");
      } else {
        td.classList.add("index-odd");
      }
      trMinor.appendChild(td).appendChild(document.createTextNode(j));
    }
    if (!useIndexParityColor) {
      formatLabelCellsHorizontal(indexHeadings);
    }

    table.appendChild(gStock.trSpacer.cloneNode(true));

    let buildTdData = (j, x) => buildTdDataCell((typeof x == "string") ? x : formatCogTeeth(x));
    let buildTdHeadingGroup = (x) => buildTdDataCell(formatCogsGroup(x));
    let buildTdHeadingModel = (x) =>
        [
          buildTdDataCell(formatCogInfoBrand(x.brand)),
          buildTdDataCell(x.model),
        ];
    let [rowsHeadings, rowsData, rowsCohort, rowsRelated, rowsEqual] =
      buildUnevenCellGrid(
        cogsDatabase,
        buildTdData,
        [
          (x) => [undefined,                    [x[groupIndex]]],
          (x) => [buildTdHeadingGroup(x.group), x.infos],
          (x) => [buildTdHeadingModel(x),       [gCogsData.get(x.sprockets), x.sprockets].flat()],
        ]);

    rowsData.forEach((x) => formatDataCellsHorizontal(x[0]));
    rowsData.forEach((x) => formatDataCellsHorizontal(x[1]));
    rowsData.forEach((x) => formatDataCellsHorizontal(x.slice(2)));
    applyCellGridMergedHorizontal(
      rowsHeadings,
      (x) => x.classList.contains("data"),
      formatDataCellsHorizontal);
    for (let i = 0; i < rowsData.length; ++i) {
      let related = rowsRelated[i].map((x) => rowsData[x]).flat();
      let equal = rowsEqual[i].map((x) => rowsData[x]).flat();
      for (let cell of rowsData[i]) {
        buildHover(cell, rowsCohort[i].concat(rowsData[i]), related, equal);
      }
    }

    for (let i = 0; i < rowsData.length; ++i) {
      let tr = table.appendChild(gStock.trPlain.cloneNode());
      rowsHeadings[i].forEach((x) => tr.appendChild(x));
      // Range and delta
      if (groupIndex > 0) {
        tr.appendChild(gStock.tdSpacer.cloneNode());
        for (let j = (includeRange ? 0 : 1); (j < 2) && (j < rowsData[i].length); ++j) {
          tr.appendChild(rowsData[i][j]);
        }
      }
      // Cog size
      tr.appendChild(gStock.tdSpacer.cloneNode());
      for (let j = 2; j < rowsData[i].length; ++j) {
        tr.appendChild(rowsData[i][j]);
      }
      // Annotations
      // TODO: Cog clocking
      let td = gStock.tdInfo.cloneNode();
      td.setAttribute("colspan", 15);
      let info = cogsDatabase[groupIndex].infos[i];
      if (info.grams) {
        td.appendChild(document.createTextNode(formatWeightG(info.grams)));
      }
      if (info.note) {
        if (td.childNodes.length > 0) {
          td.appendChild(document.createTextNode(", "));
        }
        td.appendChild(document.createTextNode(info.note));
      }
      if (info.url) {
        if (td.childNodes.length > 0) {
          td.appendChild(document.createTextNode(", "));
        }
        let anchor = document.createElement("a");
        anchor.href = info.url;
        anchor.innerText = anchor.hostname;
        td.appendChild(anchor);
      }
      tr.appendChild(td);
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  var parentElement = document.getElementById(parentId);
  purgeChildren(parentElement);
  parentElement.appendChild(table);
}

function buildChainrings() {
  let cogs = CHAINRINGS_INFO;
  let formatter = formatChainringsGroup;
  calcCogsData(cogs);
  buildCogsTable("chainrings-div", cogs, formatter, false, true);
}

function buildClusters() {
  let cogs = CLUSTERS_INFO;
  let formatter = formatClustersGroup;
  calcCogsData(cogs);
  buildCogsTable("clusters-div", cogs, formatter, true, false);
}
