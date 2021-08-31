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

function buildTdDataCell (text) {
  var td = gStock.tdData.cloneNode();
  if (text) {
    td.appendChild(document.createTextNode(text));
  }
  return td;
}

function __handleHoverEnter (eventInfo, cohortNodes, relatedNodes, equalNodes) {
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

function __handleHoverLeave (eventInfo, cohortNodes, relatedNodes, equalNodes) {
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
  node.addEventListener("mouseover", (x) => __handleHoverEnter(x, cohortNodes, relatedNodes, equalNodes));
  node.addEventListener("mouseout", (x) => __handleHoverLeave(x, cohortNodes, relatedNodes, equalNodes));
}

function buildCogsTable (parentId, cogsDatabase, formatCogsGroup, includeRange, useIndexParityColor) {
  var table;

  table = gStock.tableCogs.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  for (let groupIndex = 0; groupIndex < cogsDatabase.length; ++groupIndex) {
    // Spacer row between groups
    if (groupIndex > 0) {
      table.appendChild(gStock.trSpacer.cloneNode(true));
    }

    // Group heading row
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
      let td = trMinor.appendChild(gStock.tdPlain.cloneNode());
      indexHeadings.push(td);
      if (useIndexParityColor) {
        td.classList.add((j % 2 == 0) ? "index-even" : "index-odd");
      } else {
        td.classList.add("index-even");
      }
      td.appendChild(document.createTextNode(j));
    }
    if (!useIndexParityColor) {
      formatLabelCellsHorizontal(indexHeadings);
    }

    // Spacer row between heading and data in this group
    table.appendChild(gStock.trSpacer.cloneNode(true));

    // Build heading columns and data
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
          // Start with delving into group
          (x) => [
            undefined,
            [x[groupIndex]],
          ],
          // Build heading column for group 
          (x) => [
            buildTdHeadingGroup(x.group),
            x.infos,
          ],
          // Build heading columns for brand and model
          // Emit data columns for range, delta, and cog sizes
          (x) => [
            buildTdHeadingModel(x),
            [
              formatCogInfoSize(x),
              Math.max(...x.sprockets) - Math.min(...x.sprockets),
              x.sprockets
            ].flat(),
          ],
        ]);

    // Format the heading columns
    let relatedHeadings = clumpRelatedCells(
      rowsHeadings,
      (x, run) => x.classList.contains("data") && ((run.length == 0) || (x.childNodes.length == 0)));
    for (let row of relatedHeadings) {
      // "Merge" empty cells into their left neighbor
      row.forEach((x) => formatDataCellsHorizontal(x));
    }

    // Format the range column
    rowsData.forEach((x) => formatDataCellsHorizontal(x[0]));

    // Format the delta column
    rowsData.forEach((x) => formatDataCellsHorizontal(x[1]));
    //
    // Format the cog size columns
    rowsData.forEach((x) => formatDataCellsHorizontal(x.slice(2)));

    // Apply cursor hover to the data cells only
    for (let i = 0; i < rowsData.length; ++i) {
      let related = rowsRelated[i].map((x) => rowsData[x]).flat();
      let equal = rowsEqual[i].map((x) => rowsData[x]).flat();
      for (let cell of rowsData[i]) {
        buildHover(cell, rowsCohort[i].concat(rowsData[i]), related, equal);
      }
    }

    // Add our rows to the table
    for (let i = 0; i < rowsData.length; ++i) {
      let tr = table.appendChild(gStock.trPlain.cloneNode());

      // Add column headings to the row
      rowsHeadings[i].forEach((x) => tr.appendChild(x));

      // Add range and delta columns
      if (groupIndex > 0) {
        tr.appendChild(gStock.tdSpacer.cloneNode());
        for (let j = (includeRange ? 0 : 1); (j < 2) && (j < rowsData[i].length); ++j) {
          tr.appendChild(rowsData[i][j]);
        }
      }

      // Add cog size columns
      tr.appendChild(gStock.tdSpacer.cloneNode());
      for (let j = 2; j < rowsData[i].length; ++j) {
        tr.appendChild(rowsData[i][j]);
      }

      // Add annotations
      // TODO: Cog clocking
      let td = tr.appendChild(gStock.tdInfo.cloneNode());
      td.setAttribute("colspan", 15);
      let info = cogsDatabase[groupIndex].infos[i];
      if (info.grams) {
        td.appendChild(document.createTextNode(formatWeightG(info.grams)));
      }
      if (info.note) {
        if (td.childNodes.length) {
          td.appendChild(document.createTextNode(", "));
        }
        td.appendChild(document.createTextNode(info.note));
      }
      if (info.url) {
        if (td.childNodes.length) {
          td.appendChild(document.createTextNode(", "));
        }
        let a = document.createElement("a");
        a.href = info.url;
        a.innerText = a.hostname;
        td.appendChild(a);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  var parentElement = document.getElementById(parentId);
  purgeChildren(parentElement);
  parentElement.appendChild(table);
}

function buildChainrings() {
  buildCogsTable("chainrings-div", CHAINRINGS_INFO, formatChainringsGroup, false, true);
}

function buildClusters() {
  buildCogsTable("clusters-div", CLUSTERS_INFO, formatClustersGroup, true, false);
}
