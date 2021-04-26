var gStock = {
  tableChainrings: document.createElement("table"),
  trPlain: document.createElement("tr"),
  trInvisible: document.createElement("tr"),
  tdPlain: document.createElement("td"),
  tdEmpty: document.createElement("td"),
  tdData: document.createElement("td"),
  tdHeading: document.createElement("td"),
  tdHeadingRatio: document.createElement("td"),
  tdInvisible: document.createElement("td"),
}
gStock.tableChainrings.className = "chainrings";
gStock.tdEmpty.className = "empty";
gStock.tdData.className = "data";
gStock.tdHeading.className = "heading";
gStock.tdHeadingRatio.className = "heading-ratio";
gStock.tdInvisible.className = "invisible";
gStock.trInvisible.appendChild(gStock.tdInvisible.cloneNode());

var gChainrings = new Map();

function calcChainrings () {
  for (let group of CHAINRINGS_INFO) {
    for (let info of group.infos) {
      for (let model of info.models) {
        let min = Math.min(...model.sprockets);
        let max = Math.max(...model.sprockets);
        let data = [max - min];
        gChainrings.set(model.sprockets, data.concat(model.sprockets));
      }
    }
  }
}

function buildTdDataCell (text) {
  var td = gStock.tdData.cloneNode();
  formatDataCellsHorizontal(td);
  if (text) {
    td.appendChild(document.createTextNode(text));
  }
  return td;
}

function buildCellsGrid (node, buildDataCell, resolvers, depth=0) {
  var rowsCells = [];
  var rowsData = [];

  var [headings, children] = resolvers[depth](node);
  if (!(headings instanceof Array)) {
    headings = [headings];
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

    rowsData = [row];
    rowsCells = [headings.concat(row)];
  } else {
    for (let child of children) {
      var [rowsCellsChild, rowsDataChild] = buildCellsGrid(child, buildDataCell, resolvers, depth + 1);
      rowsCells = rowsCells.concat(rowsCellsChild);
      rowsData = rowsData.concat(rowsDataChild);
    }

    for (let heading of headings) {
      if (heading) {
        if (heading instanceof HTMLElement) {
          // TODO: There's probably a better way of attaching the leaf count to this element
          heading.setAttribute("rowspan", rowsCells.length);
        }
        rowsCells[0].unshift(heading);
      }
    }
  }

  return [rowsCells, rowsData];
}

function buildChainringsTable () {
  var table;

  table = gStock.tableChainrings.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  for (let i = 0; i < CHAINRINGS_INFO.length; ++i) {
    if (i > 0) {
      table.appendChild(gStock.trInvisible.cloneNode(true))
    }

    let trMinor = table.appendChild(gStock.trPlain.cloneNode());
    trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Group"));
    trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Manufacturer"));
    trMinor.appendChild(gStock.tdHeading.cloneNode()).appendChild(document.createTextNode("Model"));
    trMinor.appendChild(gStock.tdEmpty.cloneNode());
    if (i > 0) {
      trMinor.appendChild(gStock.tdHeadingRatio.cloneNode()).innerHTML = "&Delta;";
      trMinor.appendChild(gStock.tdEmpty.cloneNode());
    }
    for (let j = CHAINRINGS_INFO[i].group; j > 0; --j) {
      let td = gStock.tdPlain.cloneNode();
      if (j % 2 == 0) {
        td.classList.add("index-even");
      } else {
        td.classList.add("index-odd");
      }
      trMinor.appendChild(td).appendChild(document.createTextNode(j));
    }

    table.appendChild(gStock.trInvisible.cloneNode(true))

    let buildTdData = (j, x) => buildTdDataCell(formatCogTeeth(x));
    let buildTdHeadingGroup = (x) => buildTdDataCell(formatChainringsGroup(x));
    let buildTdHeadingBrand = (x) => buildTdDataCell(x);
    let buildTdHeadingModel = (x) =>
      (i > 0) ?
        [
          buildTdDataCell(x.model),
          gStock.tdEmpty.cloneNode(),
          buildTdDataCell(formatCogTeeth(gChainrings.get(x.sprockets)[0])),
          gStock.tdEmpty.cloneNode(),
        ] :
        [
          buildTdDataCell(x.model),
          gStock.tdEmpty.cloneNode(),
        ];
    let [rowsCells, rowsData] =
      buildCellsGrid(
        CHAINRINGS_INFO,
        buildTdData,
        [
          (x) => [undefined,                    [x[i]]],
          (x) => [buildTdHeadingGroup(x.group), x.infos],
          (x) => [buildTdHeadingBrand(x.brand), x.models],
          (x) => [buildTdHeadingModel(x),       x.sprockets]
        ]);
    for (let row of rowsData) {
      formatDataCellsHorizontal(row);
    }
    for (let row of rowsCells) {
      let tr = table.appendChild(gStock.trPlain.cloneNode());
      for (let column of row) {
        tr.appendChild(column);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  var chainringsDiv = document.getElementById("chainrings-div")
  purgeChildren(chainringsDiv);
  chainringsDiv.appendChild(table);
}

function build() {
  calcChainrings();
  buildChainringsTable();
}
