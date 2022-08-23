// TODO: replace gStock with stockElement() function that takes type + class names
var gStock = {
  tableGearing: document.createElement("table"),
  tablePower: document.createElement("table"),
  trPlain: document.createElement("tr"),
  tdPlain: document.createElement("td"),
  tdSpacer: document.createElement("td"),
  tdEmpty: document.createElement("td"),
  tdData: document.createElement("td"),
  tdHeadingRatio: document.createElement("td"),
  tdHeadingSpeedFromCadence: document.createElement("td"),
  tdHeadingCadenceAtSpeed: document.createElement("td"),
  tdHeadingTorqueFromCadence: document.createElement("td"),
  tdHeadingSpeedFromGrade: document.createElement("td"),
  tdHeading: document.createElement("td"),
  tdHeadingIndex: document.createElement("td"),
  trSpacer: document.createElement("tr"),
  spanEmoji: document.createElement("span"),
  divPlain: document.createElement("div"),
  divDogEar: document.createElement("div"),
  divTdPopoverRatio: document.createElement("div"),
  divTdPopoverSpeedFromCadence: document.createElement("div"),
  divTdPopoverCadenceAtSpeed: document.createElement("div"),
  divTdPopoverTorqueFromCadence: document.createElement("div"),
  divTdPopoverSpeedFromGrade: document.createElement("div"),
};
gStock.tableGearing.className = "gearing";
gStock.tablePower.className = "power";
gStock.tdSpacer.className = "spacer";
gStock.tdEmpty.className = "empty";
gStock.tdData.className = "data";
gStock.tdHeadingRatio.className = "heading-ratio";
gStock.tdHeadingSpeedFromCadence.className = "heading-speed-from-cadence";
gStock.tdHeadingCadenceAtSpeed.className = "heading-cadence-from-speed";
gStock.tdHeadingTorqueFromCadence.className = "heading-torque-from-cadence";
gStock.tdHeadingSpeedFromGrade.className = "heading-speed-from-grade";
gStock.tdHeading.className = "heading";
gStock.tdHeadingIndex.className = "heading-index";
gStock.trSpacer.appendChild(gStock.tdSpacer.cloneNode());
gStock.spanEmoji.className = "emoji";
gStock.divDogEar.className = "dog-ear";
gStock.divTdPopoverRatio.classList.add("td-pop-over");
gStock.divTdPopoverRatio.classList.add("heading-ratio");
gStock.divTdPopoverSpeedFromCadence.classList.add("td-pop-over");
gStock.divTdPopoverSpeedFromCadence.classList.add("heading-speed-from-cadence");
gStock.divTdPopoverCadenceAtSpeed.classList.add("td-pop-over");
gStock.divTdPopoverCadenceAtSpeed.classList.add("heading-cadence-from-speed");
gStock.divTdPopoverTorqueFromCadence.classList.add("td-pop-over");
gStock.divTdPopoverTorqueFromCadence.classList.add("heading-torque-from-cadence");
gStock.divTdPopoverSpeedFromGrade.classList.add("td-pop-over");
gStock.divTdPopoverSpeedFromGrade.classList.add("heading-speed-from-grade");

//////////////////////////////////////////////////////////////////////////////

function __formatCogInfo (infos, formatGroup, formatEntry) {
  return infos.map(
    (x) => [
      formatGroup(x.group),
      x.infos.map(formatEntry),
    ]);
}

var CHAINRINGS = __formatCogInfo(CHAINRINGS_INFO, formatChainringsGroup, (x) => formatCogInfoEntry(x, true));
var CLUSTERS =  __formatCogInfo(CLUSTERS_INFO, formatClustersGroup, (x) => formatCogInfoEntry(x, false));

//////////////////////////////////////////////////////////////////////////////

var gCogsCluster = [ 36, 32, 28, 25, 22, 19, 17, 15, 13, 12, 11 ];
var gCogsChainring = [ 34, 50 ];

var gRatioByChainringAndCluster = [];
var gGearIndexByChainringAndCluster = [];
var gGearInchesByChainringAndCluster = [];
var gLegPowerByChainringAndRatio = [];
var gLegForceByChainringAndRatio = [];
var gSpeedByChainringAndRatio = [];
var gCadenceByChainringAndRatio = [];
var gWheelTorqueByChainringAndRatio = [];

var gRatioSchmoo = [];
var gCadenceSchmoo = [];
var gGradeSchmoo = [];
var gSpeedSchmoo = [];
var gLegForceByCadenceAndRatio = [];
var gLegPowerByCadenceAndRatio = [];
var gSpeedByCadenceAndRatio = [];
var gCadenceBySpeedAndRatio = [];
var gCadenceByGradeAndRatio = [];
var gSpeedByGradeAndRatio = [];
var gLegForceByGradeAndRatio = [];
var gLegPowerByGradeAndRatio = [];

var gConfig = {
  chainrings:    { value: "1,16",               order: 1,  choices: CHAINRINGS },
  cluster:       { value: "6,8",                order: 2,  choices: CLUSTERS },
  tireSize:      { value: 60,                   order: 3,  choices: TIRE_SIZES },
  tireCircMm:    { value: 2096,                            formatter: formatLengthMm },
  capacityFront: { value: 0,                               formatter: formatCogTeeth }, // Calculated
  capacityRear:  { value: 0,                               formatter: formatCogTeeth }, // Calculated
  capacityTotal: { value: 0,                               formatter: formatCogTeeth }, // Calculated
  speedUnits:    { value: "MPH" },
  speedMph:      { value: 15,                   order: 12, formatter: formatSpeed },
  weightRider:   { value: 150,                  order: 5,  formatter: formatWeightLb },
  weightBike:    { value: 20,                   order: 6,  formatter: formatWeightLb },
  weightKit:     { value: 2,                    order: 7,  formatter: formatWeightLb },
  weightGear:    { value: 3,                    order: 8,  formatter: formatWeightLb },
  weightTotal:   { value: 0,                               formatter: formatWeightLbAndKg }, // Calculated
  position:      { value: 1,                    order: 9,  choices: ["Tops", "Hoods", "Drops"] },
  gradePercent:  { value: 6,         step: 0.5, order: 10, formatter: formatPercent },
  cadenceRpm:    { value: 90,                   order: 11, formatter: formatCadence },
  toleranceRpm:  { value: 15,                   order: 14, formatter: formatCadence },
  stepRpm:       { value: 10,                   order: 13, formatter: formatCadence },
  cadenceRpmMin: { value: 50,                   order: 15, formatter: formatCadence },
  cadenceRpmMax: { value: 110,                  order: 16, formatter: formatCadence },
  crankLength:   { value: 170,                  order: 4,  formatter: formatLengthMm },
  powerFtp:      { value: 200,                  order: 17, formatter: formatPower },
  powerZ2:       { value: 0,                               formatter: formatPower }, // Calculated
  powerZ3:       { value: 0,                               formatter: formatPower }, // Calculated
  powerZ4:       { value: 0,                               formatter: formatPower }, // Calculated
  powerZ5:       { value: 0,                               formatter: formatPower }, // Calculated
  powerZ6:       { value: 0,                               formatter: formatPower }, // Calculated
  fitnessRatio:  { value: 0,                               formatter: formatFitness }, // Calculated
}
var gPowerZone = [
  0,        // Placeholder
  0,        // Zone 1
  0 * 0.56, // Zone 2
  0 * 0.76, // Zone 3
  0 * 0.91, // Zone 4
  0 * 1.06, // Zone 5
  0 * 1.21, // Zone 6
  0 * 1.50, // End of power zones
]
var gPowerBurst = {
  low: 850,
  high: 1500,
  dead: 1000000,
}

var gSwitches = {
  gearing_table:         { value: true,  label: "Show"             },
  gearing_indexes:       { value: true,  label: "Index"            },
  gearing_speed:         { value: true,  label: "Speed (MPH)"      },
  gearing_inches:        { value: true,  label: "Gear Inches"      },
  speedAtCadence_table:  { value: false, label: "Show"             },
  speedAtCadence_force:  { value: true,  label: "Leg Force (lbf)"  },
  speedAtCadence_power:  { value: true,  label: "Leg Power (Watt)" },
  cadenceAtSpeed_table:  { value: false, label: "Show"             },
  torqueAtCadence_table: { value: false, label: "Show"             },
  torqueAtCadence_force: { value: true,  label: "Leg Force (lbf)"  },
  speedByCadence_table:  { value: true,  label: "Show"             },
  speedByCadence_force:  { value: true,  label: "Leg Force (lbf)"  },
  speedByCadence_power:  { value: true,  label: "Leg Power (Watt)" },
  cadenceBySpeed_table:  { value: false, label: "Show"             },
  speedByGrade_table:    { value: true,  label: "Show"             },
  speedByGrade_cadence:  { value: true,  label: "Cadence"          },
  speedByGrade_force:    { value: true,  label: "Leg Force (lbf)"  },
  speedByGrade_power:    { value: true,  label: "Leg Power (Watt)" },
  powerStripe:           { value: true,  label: "Power"            },
  burstStripe:           { value: true,  label: "Burst"            },
  cadenceStripe:         { value: true,  label: "Cadence"          },
  blending:              { value: true,  label: "Blending"         },
  primaryUnits:          { value: true,  label: "Primary"          },
  secondaryUnits:        { value: true,  label: "Secondary"        },
}

//////////////////////////////////////////////////////////////////////////////

function calcSpeed (cadenceRpm, ratio, tireCircMm) {
  return cadenceRpm / ratio * convertMmToMi(tireCircMm) * 60;
}

function calcCadence (speedMph, ratio, tireCircMm) {
  return speedMph * ratio / convertMmToMi(tireCircMm) / 60;
}

function calcWheelTorque (power, wheelRpm, tireCircMm) {
  var tireRadiusMm = convertCircToRadius(tireCircMm);
  var tireRadiusFt = tireRadiusMm / 25.4 / 12;
  return calcLegForceFromPower(power, wheelRpm, tireRadiusMm) * tireRadiusFt;
}

function calcGearInches (tireCircMm, front, rear) {
  var tireDiameterIn = convertMmToIn(convertCircToRadius(tireCircMm)) * 2;
  return tireDiameterIn * front / rear;
}

function calcGearIndexByChainring (ratioByChainring) {
  function nominal (n) {
    return roundTo(n, 2);
  }

  var numGears = 0;
  var gearIndexByChainring = []

  if (ratioByChainring.length == 1) {
    // Number the gears sequentially
    gearIndexByChainring[0] = [];
    for (let j = 0; j < ratioByChainring[0].length; ++j) {
      gearIndexByChainring[0][j] = ++numGears
    }
  } else if (ratioByChainring.length == 2) {
    let i;
    let margin
    let cutoff;

    i = 0;
    if (ratioByChainring[i].length <= 1) {
      margin = 0;
    } else if (ratioByChainring[i].length <= 8) {
      margin = 1;
    } else if (ratioByChainring[i].length <= 10) {
      margin = 2;
    } else {
      margin = 4;
    }

    // Small chainring: uses the first half of the cluster
    i = 0;
    gearIndexByChainring[i] = [];
    for (let j = 0; j < ratioByChainring[i].length - margin; ++j) {
      gearIndexByChainring[i][j] = ++numGears;
    }
    cutoff = nominal(ratioByChainring[i][numGears - 1]);

    // Big chainring: uses the remaining gear ratios
    i = 1;
    gearIndexByChainring[i] = [];
    for (let j = 0; j < ratioByChainring[i].length; ++j) {
      if (nominal(ratioByChainring[i][j]) < cutoff) {
        gearIndexByChainring[i][j] = ++numGears;
      }
    }
  } else if (ratioByChainring.length == 3) {
    let i;
    let margin;
    let cutoff, cutoff2;

    // Middle chainring won't use the ends of the cluster
    i = 1;
    if (ratioByChainring[i].length <= 1) {
      margin = 0;
    } else if (ratioByChainring[i].length <= 8) {
      margin = 1;
    } else {
      margin = 2;
    }
    cutoff = nominal(ratioByChainring[i][margin]);
    cutoff2 = nominal(ratioByChainring[i][ratioByChainring[0].length - margin - 1]);

    // Middle chainring: reserve the interior ratios
    i = 1;
    gearIndexByChainring[i] = [];
    for (let j = margin; j < ratioByChainring[i].length - margin; ++j) {
      gearIndexByChainring[i][j] = true;
    }

    // Small chainring: reserve the higher ratios
    i = 0;
    gearIndexByChainring[i] = [];
    for (let j = 0; j < ratioByChainring[i].length; ++j) {
      if (nominal(ratioByChainring[i][j]) > cutoff) {
        gearIndexByChainring[i][j] = true;
      }
    }

    // Big chainring: reserve the lower ratios
    i = 2;
    gearIndexByChainring[i] = [];
    for (let j = 0; j < ratioByChainring[i].length; ++j) {
      if (nominal(ratioByChainring[i][j]) < cutoff2) {
        gearIndexByChainring[i][j] = true;
      }
    }

    // Assign gear indexes as a separate step since we built the gear table out of sequence
    for (let i = 0; i < ratioByChainring.length; ++i) {
      for (let j = 0; j < ratioByChainring[i].length; ++j) {
        if (gearIndexByChainring[i][j]) {
          gearIndexByChainring[i][j] = ++numGears;
        }
      }
    }
  }

  return gearIndexByChainring;
}

function calcTables () {
  // NOTE: We need to control the calculation order to resolve dependencies
  //       between calculation steps.  Pass the global tables to each helper
  //       function as an argument to help make this clear.  Configuration
  //       parameters are accessed via gConfig because those values are fixed
  //       ahead of time.
  
  // Gear ratios

  gRatioByChainringAndCluster = 
    calcGridFromRowAndColumnHeadings(
      gCogsChainring,
      gCogsCluster,
      (chainringTeeth, clusterTeeth) => clusterTeeth / chainringTeeth
    );

  gGearInchesByChainringAndCluster =
    calcGridFromRowAndColumnHeadings(
      gCogsChainring,
      gCogsCluster,
      (chainringTeeth, clusterTeeth) =>
        calcGearInches(
          gConfig.tireCircMm.value,
          chainringTeeth,
          clusterTeeth
        )
    );

  gGearIndexByChainringAndCluster = calcGearIndexByChainring(gRatioByChainringAndCluster);

  // Schmoos

  gCadenceSchmoo = 
    createRangeArray(-3, 3).map(
      (x) => gConfig.cadenceRpm.value + gConfig.stepRpm.value * x
    );

  gRatioSchmoo = [];
  calcGridFromGrids(
    [gGearIndexByChainringAndCluster, gRatioByChainringAndCluster],
    (index, ratio) =>
      (index && ratio) ?
        (gRatioSchmoo[index - 1] = ratio) :
        undefined
  );

  gSpeedSchmoo =
    createRangeArray(-3, 3).map(
      (x) => gConfig.speedMph.value + 2.5 * x
    );

  gGradeSchmoo = createRangeArray(0, 11, 2).concat(createRangeArray(12, 20, 4));

  var speedByGradeSchmoo = 
    gGradeSchmoo.map(
      (grade) =>
        calcSpeedFromRider(
          gConfig.powerFtp.value,
          grade,
          gConfig.weightTotal.value,
          gConfig.position.choices[gConfig.position.value]
        )
    );

  // Chainring-based grids

  gSpeedByChainringAndRatio =
    calcGridFromGrids(
      [gRatioByChainringAndCluster],
      (ratio) =>
        calcSpeed(
          gConfig.cadenceRpm.value,
          ratio,
          gConfig.tireCircMm.value
        )
    );

  gLegPowerByChainringAndRatio =
    calcGridFromGrids(
      [gSpeedByChainringAndRatio],
      (speed) =>
        calcLegPowerFromRider(
          speed,
          gConfig.gradePercent.value,
          gConfig.weightTotal.value,
          gConfig.position.choices[gConfig.position.value]
        )
    );

  gCadenceByChainringAndRatio =
    calcGridFromGrids(
      [gRatioByChainringAndCluster],
      (ratio) =>
        calcCadence(
          gConfig.speedMph.value,
          ratio,
          gConfig.tireCircMm.value
        )
    );

  gLegForceByChainringAndRatio =
    calcGridFromGrids(
      [gLegPowerByChainringAndRatio],
      (power) =>
        calcLegForceFromPower(
          power,
          gConfig.cadenceRpm.value,
          gConfig.crankLength.value
        )
    );

  gWheelTorqueByChainringAndRatio =
    calcGridFromGrids(
      [gLegPowerByChainringAndRatio, gRatioByChainringAndCluster],
      (power, ratio) =>
        calcWheelTorque(
          power,
          gConfig.cadenceRpm.value / ratio,
          gConfig.tireCircMm.value
        )
    );

  // Cadence-based grids

  gSpeedByCadenceAndRatio =
    calcGridFromRowAndColumnHeadings(
      gCadenceSchmoo,
      gRatioSchmoo,
      (cadence, ratio) =>
        calcSpeed(
          cadence,
          ratio,
          gConfig.tireCircMm.value
        )
    );

  gLegPowerByCadenceAndRatio =
    calcGridFromGrids(
      [gSpeedByCadenceAndRatio],
      (speed) =>
        calcLegPowerFromRider(
          speed,
          gConfig.gradePercent.value,
          gConfig.weightTotal.value,
          gConfig.position.choices[gConfig.position.value]
        )
    );

  gLegForceByCadenceAndRatio =
    calcGridFromRowHeadingsAndGrid(
      gCadenceSchmoo,
      gLegPowerByCadenceAndRatio,
      (cadence, power) =>
        calcLegForceFromPower(
          power,
          cadence,
          gConfig.crankLength.value
        )
    );

  // Speed-based grids

  gCadenceBySpeedAndRatio =
    calcGridFromRowAndColumnHeadings(
      gSpeedSchmoo,
      gRatioSchmoo,
      (speed, ratio) =>
        calcCadence(
          speed,
          ratio,
          gConfig.tireCircMm.value
        ),
    );

  // Grade-based grids

  gCadenceByGradeAndRatio =
    calcGridFromRowAndColumnHeadings(
      speedByGradeSchmoo,
      gRatioSchmoo,
      (speed, ratio) =>
        boundBy(
          calcCadence(
            speed,
            ratio,
            gConfig.tireCircMm.value
          ),
          gConfig.cadenceRpmMin.value,
          gConfig.cadenceRpmMax.value
        )
    );

  gSpeedByGradeAndRatio =
    calcGridFromColumnHeadingsAndGrid(
      gRatioSchmoo,
      gCadenceByGradeAndRatio,
      (ratio, cadence) =>
        calcSpeed(
          cadence,
          ratio,
          gConfig.tireCircMm.value
        )
    );

  gLegPowerByGradeAndRatio =
    calcGridFromRowHeadingsAndGrid(
      gGradeSchmoo,
      gSpeedByGradeAndRatio,
      (grade, speed) =>
        calcLegPowerFromRider(
          speed,
          grade,
          gConfig.weightTotal.value,
          gConfig.position.choices[gConfig.position.value]
        )
    );

  gLegForceByGradeAndRatio =
    calcGridFromGrids(
      [gCadenceByGradeAndRatio, gLegPowerByGradeAndRatio],
      (cadence, power) =>
        calcLegForceFromPower(
          power,
          cadence,
          gConfig.crankLength.value
        )
    );
}

//////////////////////////////////////////////////////////////////////////////

function colorGridByGearIndex (cellGrid, dataGrid, gearIndexByChainring) {
  let even = new Set();

  // Arrays are zero-based, but humans are one-based, so odd row indexes are considered even
  for (let i = 1; i < gearIndexByChainring.length; i += 2) {
    for (let j = 0; j < gearIndexByChainring[i].length; ++j) {
      even.add(gearIndexByChainring[i][j]);
    }
  }

  for (let i = 0; i < dataGrid.length; ++i) {
    for (let j = 0; j < dataGrid[i].length; ++j) {
      if (dataGrid[i].hasOwnProperty(j)) {
        if (even.has(dataGrid[i][j])) {
          cellGrid[i][j].classList.add("index-even");
        } else {
          cellGrid[i][j].classList.add("index-odd");
        }
      }
    }
  }
}

function colorRatioGridConditionally (cellGrid, predicateGrid) {
  for (let i = 0; i < cellGrid.length; ++i) {
    for (let j = 0; j < cellGrid[i].length; ++j) {
      if (predicateGrid.hasOwnProperty(i) &&
        predicateGrid[i].hasOwnProperty(j))
      {
        cellGrid[i][j].classList.add("ratio-selected");
      } else {
        cellGrid[i][j].classList.add("ratio-unselected");
      }
    }
  }
}

function colorGridsByRatio (cellGrids, dataGrid) {
  colorGradient50Percentile(cellGrids, dataGrid, ["grad-pos-low", "grad-pos-middle", "grad-pos-high"]);
}

function colorGridsBySpeed (cellGrids, dataGrid) {
  colorGradient(cellGrids, dataGrid, true, [
      [5, "grad-neg-low"],
      [13, "grad-neg-middle"],
      [30, "grad-neg-high"],
    ]);
}

function colorGridsByCadence (cellGrids, dataGrid) {
  colorGradient(cellGrids, dataGrid, true, [
      [0, "grad-neg-low"],
      [90, "grad-neg-middle"],
      [120, "grad-neg-high"],
      [200, "grad-neg-dead"],
    ]);
}

function colorGridsByCadenceZone (cellGrids, dataGrid) {
  if (gSwitches.cadenceStripe.value) {
    colorGradient(cellGrids, dataGrid, false, [
        [gConfig.cadenceRpm.value - gConfig.toleranceRpm.value, "grad-cadence-low"],
        [gConfig.cadenceRpm.value + gConfig.toleranceRpm.value, "grad-cadence-high"],
      ]);
  }
}

function colorGridsByWheelTorque (cellGrids, dataGrid) {
  colorGradient50Percentile(cellGrids, dataGrid, ["grad-neg-low", "grad-neg-middle", "grad-neg-high"]);
}

function colorGridsByPowerZone (cellGrids, dataGrid) {
  if (gSwitches.burstStripe.value) {
    colorGradient(cellGrids, dataGrid, false, [
        [gPowerBurst.low, "grad-burst-low"],
        [gPowerBurst.high, "grad-burst-high"],
        [gPowerBurst.dead, "grad-burst-dead"],
      ]);
  }
  if (gSwitches.powerStripe.value) {
    colorGradient(cellGrids, dataGrid, false, [
        [gPowerZone[2], "grad-ftp-zone2"],
        [gPowerZone[3], "grad-ftp-zone3"],
        [gPowerZone[4], "grad-ftp-zone4"],
        [gPowerZone[5], "grad-ftp-zone5"],
        [gPowerZone[7], "grad-ftp-high"],
      ]);
  }
}

function formatCadenceCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("cadence");
    }
  }
}

function formatPowerCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("power");
    }
  }
}

function formatForceCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("force");
    }
  }
}

function formatGearIndexCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("index");
    }
  }
}

function handlePopoverEnter (eventInfo) {
  var target = eventInfo.currentTarget;
  var child = target.lastChild;

  child.style.display = "";
  targetStyle = window.getComputedStyle(target);
  childStyle = window.getComputedStyle(child);

  targetHeight = parseInt(targetStyle.height, 10);
  childHeight = parseInt(childStyle.height, 10);
  if (targetHeight > childHeight) {
    child.style.height = targetStyle.height;
  }

  targetWidth = parseInt(targetStyle.width, 10);
  childWidth = parseInt(childStyle.width, 10);
  if (targetWidth > childWidth) {
    child.style.width = targetStyle.width;
  }
}

function handlePopoverLeave (eventInfo) {
  // Once this node is hidden, it can trigger the underlying node, which might
  // unhide this node!  So stop the event propogation now.
  eventInfo.stopPropagation();

  eventInfo.currentTarget.style.display = "none";
}

function addPopover (parentNode, popoverNode) {
  parentNode.appendChild(gStock.divDogEar.cloneNode());
  parentNode.appendChild(popoverNode);
  parentNode.addEventListener("mouseover", handlePopoverEnter);

  popoverNode.style.display = "none";
  popoverNode.addEventListener("mouseout", handlePopoverLeave);
  // Handle click event for touch-based devices
  popoverNode.addEventListener("click", handlePopoverLeave);
}

function addEmoji (node, kind) {
  var code;
  if (kind == "gear") {
    code = "&#x2699;&#xFE0F;";
  } else if (kind == "bike") {
    code = "&#x1F6B4;";
  } else if (kind == "circle") {
    code = "&#x1F504;";
  } else if (kind == "scale") {
    code = "&#x2696;&#xFE0F;";
  } else if (kind == "wrench") {
    code = "&#x1F527;";
  } else if (kind == "mountain") {
    code = "&#x26F0;&#xFE0F;";
  }
  var span = node.appendChild(gStock.spanEmoji.cloneNode());
  span.innerHTML = code;
}

function buildGridsAndFormatters (info) {
  let grids = [];
  let formatters = [];
  let indexes = [];
  for (let i = 0; i < info.length; ++i) {
    let [enabled, grid, formatter, primary] = info[i];
    if (enabled) {
      grids.push(grid);
      formatters.push(
        (x) => formatter(
          x,
          primary ?
            gSwitches.primaryUnits.value :
            gSwitches.secondaryUnits.value));
      indexes[i] = grids.length - 1;
    }
  }
  return [grids, formatters, indexes];
}

function buildGearingTable () {
  var table;
  var trHeading;
  var tdMajor, tdMinor;
  var div;
  var cells;

  //////////////////////////////////////////////////////////////////////////////

  table = gStock.tableGearing.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  trHeading = table.appendChild(gStock.trPlain.cloneNode());
  trHeading.appendChild(gStock.tdSpacer.cloneNode());
  trHeading.appendChild(gStock.tdSpacer.cloneNode());

  tdMinor = [];
  for (let i = 0; gCogsCluster[i]; ++i) {
    let td = gStock.tdHeading.cloneNode();
    td.appendChild(document.createTextNode(formatCogTeeth(gCogsCluster[i])));
    tdMinor.push(td);
    trHeading.appendChild(td);
  }
  formatLabelCellsHorizontal(tdMinor);

  //////////////////////////////////////////////////////////////////////////////

  tdMinor = [];
  for (let i = 0; i < gCogsChainring.length; ++i) {
    let td = gStock.tdHeading.cloneNode();
    td.appendChild(document.createTextNode(formatCogTeeth(gCogsChainring[i])));
    tdMinor.push(td);
  }
  formatLabelCellsVertical(tdMinor);

  if (gSwitches.gearing_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingRatio.cloneNode();
    addEmoji(tdMajor, "gear");
    div = gStock.divTdPopoverRatio.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "What are the unique gear combinations?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="gearing_indexes"></span>' +
      "<li>Ratio (Front &divide; Rear)" +
      '<li><span id="gearing_inches"></span>' +
      '<li><span id="gearing_speed"></span>' +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    // TODO: 2D grid of { [array of TD elements (innerHtml = formatXXX())], index:, ratio:, gearInches:, speed: }
    let [grids, formatters, indexes] =
      buildGridsAndFormatters([
          [gSwitches.gearing_indexes.value, gGearIndexByChainringAndCluster, formatNone, false],
          [true, gRatioByChainringAndCluster, formatRatio, true],
          [gSwitches.gearing_inches.value, gGearInchesByChainringAndCluster, formatGearInches, true],
          [gSwitches.gearing_speed.value, gSpeedByChainringAndRatio, formatSpeed, false],
        ]);
    let [nums, ratios, inches, speeds] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    if (nums >= 0) {
      colorGridByGearIndex(cells[nums], gGearIndexByChainringAndCluster, gGearIndexByChainringAndCluster);
      formatGearIndexCells(cells[nums]);
    }
    if (speeds >= 0) {
      colorRatioGridConditionally(cells[speeds], gGearIndexByChainringAndCluster);
      colorGridsByRatio([cells[speeds]], gRatioByChainringAndCluster);
    }
    if (inches >= 0) {
      colorRatioGridConditionally(cells[inches], gGearIndexByChainringAndCluster);
      colorGridsByRatio([cells[inches]], gRatioByChainringAndCluster);
    }
    if (ratios >= 0) {
      colorRatioGridConditionally(cells[ratios], gGearIndexByChainringAndCluster);
      colorGridsByRatio([cells[ratios]], gRatioByChainringAndCluster);
    }
    formatCellGridsGroupsConditionally(cells, gGearIndexByChainringAndCluster);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.speedAtCadence_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingSpeedFromCadence.cloneNode();
    addEmoji(tdMajor, "bike");
    div = gStock.divTdPopoverSpeedFromCadence.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast can I ride at my preferred cadence?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="speedAtCadence_force"></span>' +
      '<li><span id="speedAtCadence_power"></span>' +
      '<li>Speed (MPH)' +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.cadenceRpm.value + " RPM" +
      "</ul>" +
      "<div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedAtCadence_force.value, gLegForceByChainringAndRatio, formatForce, false],
      [gSwitches.speedAtCadence_power.value, gLegPowerByChainringAndRatio, formatPower, false],
      [true, gSpeedByChainringAndRatio, formatSpeed, true]]);
    let [force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByChainringAndRatio);
    colorGridsByPowerZone(cells, gLegPowerByChainringAndRatio);
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    if (power >= 0) {
      formatPowerCells(cells[power]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.cadenceAtSpeed_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingCadenceAtSpeed.cloneNode();
    addEmoji(tdMajor, "circle");
    div = gStock.divTdPopoverCadenceAtSpeed.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast do I have to pedal at my preferred cruising speed?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      "<li>Cadence (RPM)" +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.speedMph.value + " MPH" +
      "</ul>" +
      "<div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters] = buildGridsAndFormatters([
      [true, gCadenceByChainringAndRatio, formatCadence, true]]);

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsByCadence(cells, gCadenceByChainringAndRatio);
    colorGridsByCadenceZone(cells, gCadenceByChainringAndRatio);
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.torqueAtCadence_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingTorqueFromCadence.cloneNode();
    addEmoji(tdMajor, "wrench");
    div = gStock.divTdPopoverTorqueFromCadence.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How much of my torque is delivered to the ground?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="torqueAtCadence_force"></span>' +
      "<li>Wheel Torque (lb-ft)" +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.cadenceRpm.value + " RPM" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.torqueAtCadence_force.value, gLegForceByChainringAndRatio, formatForce, false],
      [true, gWheelTorqueByChainringAndRatio, formatTorque, true]]);
    let [force] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsByWheelTorque(cells, gWheelTorqueByChainringAndRatio);
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  var gearingDiv = document.getElementById("gearing-div")
  purgeChildren(gearingDiv);
  gearingDiv.appendChild(table);
}

function buildPowerTable () {
  var table;
  var trHeading, tdMajor, tdMinor;
  var span;
  var cells;

  var numGears = gRatioSchmoo.length;

  //////////////////////////////////////////////////////////////////////////////

  table = gStock.tablePower.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  tdMajor = gStock.tdSpacer.cloneNode();

  tdMinor = gStock.tdHeadingIndex.cloneNode();
  tdMinor.appendChild(document.createTextNode("Index"));

  let gearNumbers = [];
  for (let i = 1; i <= numGears; ++i) {
    gearNumbers.push(i);
  }

  cells = [];
  cells[0] = [addRow(table, tdMajor, tdMinor, gearNumbers, formatNone)];
  colorGridByGearIndex(cells[0], [gearNumbers], gGearIndexByChainringAndCluster);

  //////////////////////////////////////////////////////////////////////////////

  tdMajor = gStock.tdSpacer.cloneNode();

  tdMinor = gStock.tdHeadingRatio.cloneNode();
  tdMinor.appendChild(document.createTextNode("Ratio"));

  cells[1] = [addRow(table, tdMajor, tdMinor, gRatioSchmoo, formatRatio)];
  colorGridsByRatio([cells[1]], [gRatioSchmoo]);

  //////////////////////////////////////////////////////////////////////////////

  formatCellGridGroups(cells);

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.speedByCadence_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingSpeedFromCadence.cloneNode();
    addEmoji(tdMajor, "bike");
    div = gStock.divTdPopoverSpeedFromCadence.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast can I ride over my range of preferred cadences?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="speedByCadence_force"></span>' +
      '<li><span id="speedByCadence_power"></span>' +
      "<li>Speed (MPH)" +
      "</ul>" +
      "<h2>Swept over</h2>" +
      "<ul>" +
      "<li>Cadence (RPM)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = [];
    for (let i = 0; i < gCadenceSchmoo.length; ++i) {
      let td = gStock.tdHeading.cloneNode();
      td.appendChild(document.createTextNode(formatCadence(gCadenceSchmoo[i])));
      tdMinor.push(td);
    }
    formatLabelCellsVertical(tdMinor);

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedByCadence_force.value, gLegForceByCadenceAndRatio, formatForce, false],
      [gSwitches.speedByCadence_power.value, gLegPowerByCadenceAndRatio, formatPower, false],
      [true, gSpeedByCadenceAndRatio, formatSpeed, true]]);
    let [force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByCadenceAndRatio);
    colorGridsByPowerZone(cells, gLegPowerByCadenceAndRatio);
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    if (power >= 0) {
      formatPowerCells(cells[power]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.cadenceBySpeed_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingCadenceAtSpeed.cloneNode();
    addEmoji(tdMajor, "circle");
    div = gStock.divTdPopoverCadenceAtSpeed.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast do I have to pedal over my range of my preferred speeds?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      "<li>Cadence (RPM)" +
      "</ul>" +
      "<h2>Swept over</h2>" +
      "<ul>" +
      "<li>Speed (MPH)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = [];
    for (let i = 0; i < gSpeedSchmoo.length; ++i) {
      let td = gStock.tdHeading.cloneNode();
      td.appendChild(document.createTextNode(formatSpeed(gSpeedSchmoo[i])));
      tdMinor.push(td);
    }
    formatLabelCellsVertical(tdMinor);

    let [grids, formatters] = buildGridsAndFormatters([
      [true, gCadenceBySpeedAndRatio, formatCadence, true]]);

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters)
    colorGridsByCadence(cells, gCadenceBySpeedAndRatio);
    colorGridsByCadenceZone(cells, gCadenceBySpeedAndRatio);
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.speedByGrade_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingSpeedFromGrade.cloneNode();
    addEmoji(tdMajor, "mountain");
    div = gStock.divTdPopoverSpeedFromGrade.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "<p>How fast can I ride on long stretches of road with steady " +
      "grades while sustaining high power at feasible cadences?" +
      "<p>(In other words, how much of the gear range can I use for " +
      "long steady road segments?)" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="speedByGrade_cadence"></span> (' + gConfig.cadenceRpmMin.value + " &ndash; " + gConfig.cadenceRpmMax.value + " RPM)" +
      '<li><span id="speedByGrade_force"></span>' +
      '<li><span id="speedByGrade_power"></span>' +
      "<li>Speed (MPH)" +
      "</ul>" +
      "<h2>Swept over</h2>" +
      "<ul>" +
      "<li>Grade (%)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = [];
    for (let i = 0; i < gGradeSchmoo.length; ++i) {
      let td = gStock.tdHeading.cloneNode();
      td.appendChild(document.createTextNode(formatPercent(gGradeSchmoo[i])));
      tdMinor.push(td);
    }
    formatLabelCellsVertical(tdMinor);

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedByGrade_cadence.value, gCadenceByGradeAndRatio, formatCadence, false],
      [gSwitches.speedByGrade_force.value, gLegForceByGradeAndRatio, formatForce, false],
      [gSwitches.speedByGrade_power.value, gLegPowerByGradeAndRatio, formatPower, false],
      [true, gSpeedByGradeAndRatio, formatSpeed, true]]);
    let [cadence, force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByGradeAndRatio);
    colorGridsByPowerZone(cells, gLegPowerByGradeAndRatio);
    colorGridsByCadenceZone(cells, gCadenceByGradeAndRatio, false);
    if (cadence >= 0) {
      formatCadenceCells(cells[cadence]);
    }
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    if (power >= 0) {
      formatPowerCells(cells[power]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  var powerDiv = document.getElementById("power-div")
  purgeChildren(powerDiv);
  powerDiv.appendChild(table);
}

//////////////////////////////////////////////////////////////////////////////

// TODO: Move all the data stuff to a separate file
function calcCfg () {
  gPowerZone[2] = gConfig.powerZ2.value = gConfig.powerFtp.value * 0.56;
  gPowerZone[3] = gConfig.powerZ3.value = gConfig.powerFtp.value * 0.76;
  gPowerZone[4] = gConfig.powerZ4.value = gConfig.powerFtp.value * 0.91;
  gPowerZone[5] = gConfig.powerZ5.value = gConfig.powerFtp.value * 1.06;
  gPowerZone[6] = gConfig.powerZ6.value = gConfig.powerFtp.value * 1.21;
  gPowerZone[7] = gConfig.powerFtp.value * 1.50;

  gConfig.weightTotal.value = convertLbToKg(
    gConfig.weightRider.value +
    gConfig.weightBike.value +
    gConfig.weightKit.value +
    gConfig.weightGear.value);

  gConfig.fitnessRatio.value = gConfig.powerFtp.value / convertLbToKg(gConfig.weightRider.value);

  // Chainrings, in ascending order of number of cogs
  let [chainringGroup, chainringIndex] = gConfig.chainrings.value.split(",").map(Number);
  gCogsChainring = Array.from(CHAINRINGS_INFO[chainringGroup].infos[chainringIndex].sprockets);
  gCogsChainring.sort((a, b) => a - b);

  // Cluster sprockets, in descending order of number of cogs
  let [clusterGroup, clusterIndex] = gConfig.cluster.value.split(",").map(Number);
  gCogsCluster = Array.from(CLUSTERS_INFO[clusterGroup].infos[clusterIndex].sprockets);
  gCogsCluster.sort((a, b) => b - a);

  gConfig.capacityFront.value = gCogsChainring[gCogsChainring.length - 1] - gCogsChainring[0];
  gConfig.capacityRear.value = gCogsCluster[0] - gCogsCluster[gCogsCluster.length - 1];
  gConfig.capacityTotal.value = gConfig.capacityFront.value + gConfig.capacityRear.value;

  gConfig.tireCircMm.value = TIRE_SIZE_INFO[gConfig.tireSize.value].circMm;
}

// TODO: Move all this HTML UI stuff to a separate file
function wrapFocus () {
  document.getElementById("firstField").focus();
}

function buildFocusWrap (node) {
  node.id = "firstField";

  // TODO: Doesn't handle <Shift-Tab>
  let dummy = document.getElementById("dummyBox");
  dummy.tabIndex = 0;
  // NOTE: Don't use anonymous functions because those will leak handlers
  dummy.addEventListener("focus", wrapFocus);
}

function handleInputBox (eventInfo) {
  var isChange = (eventInfo.type == "change");
  var isEnter = (eventInfo.type == "keypress" && eventInfo.key == "Enter");
  if (isChange || isEnter) {
    let converted = Number(eventInfo.currentTarget.value);
    if (!isNaN(converted)) {
      gConfig[eventInfo.currentTarget.parentNode.id].value = converted;
      refresh();
    }
  }
}

function buildInputBox (content, order, step) {
  var box = document.createElement("input");
  box.type = "number";
  box.value = content;
  box.step = step;
  box.addEventListener("keypress", handleInputBox);
  box.addEventListener("change", handleInputBox);
  if (order) {
    box.tabIndex = order;
  }
  return box;
}

function handleSelect (eventInfo) {
  gConfig[eventInfo.currentTarget.parentNode.id].value = eventInfo.currentTarget.value;
  refresh();
}

function buildDropdownList (choices, order, value) {
  var select = document.createElement("select");
  select.addEventListener("change", handleSelect);
  if (order) {
    select.tabIndex = order;
  }

  if ((choices instanceof Array) && (choices[0] instanceof Array)) {
    for (let i = 0; i < choices.length; ++i) {
      let [groupName, subchoices] = choices[i];
      let optgroup = select.appendChild(document.createElement("optgroup"));
      optgroup.label = groupName;
      for (let j = 0; j < subchoices.length; ++j) {
        let option = optgroup.appendChild(document.createElement("option"));
        option.value = [i, j];
        option.appendChild(document.createTextNode(subchoices[j]));
      }
    }
  } else {
    for (let i = 0; i < choices.length; ++i) {
      let option = select.appendChild(document.createElement("option"));
      option.value = i;
      option.appendChild(document.createTextNode(choices[i]));
    }
  }
  select.value = value;

  return select;
}

function handleCheckBox (eventInfo) {
  let converted = eventInfo.currentTarget.checked;
  gSwitches[eventInfo.currentTarget.parentNode.parentNode.id].value = converted;
  refresh();
}

function buildCheckBox (name, value) {
  var label = document.createElement("label");
  var box = label.appendChild(document.createElement("input"));
  label.appendChild(document.createTextNode(name));
  box.type = "checkbox";
  box.checked = value;
  box.addEventListener("change", handleCheckBox);
  return label;
}

function pushCfg () {
  var td;

  for (let k in gConfig) {
    let content = gConfig[k].value;
    let step = gConfig[k].step;
    let order = gConfig[k].order;
    let formatter = gConfig[k].formatter;
    let choices = gConfig[k].choices;

    let td = document.getElementById(k);
    if (td.classList.contains("editable")) {
      if (td.childNodes.length) {
        // Update current widgets
        if (formatter) {
          td.firstChild.value = content;
        } else if (choices) {
          td.firstChild.value = content;
        } else {
          // Nothing
        }
      } else {
        let fieldNode;
        // Create new widgets
        if (formatter) {
          // Numeric input box
          fieldNode = buildInputBox(content, order, step);
          td.appendChild(fieldNode);
          td.appendChild(document.createTextNode(formatter()));
        } else if (choices) {
          // Dropdown menu
          fieldNode = buildDropdownList(choices, order, content);
          td.appendChild(fieldNode);
        } else {
          td.appendChild(document.createTextNode(content));
        }
        if (order == 1 && fieldNode) {
          // Hack to make sure <Tab> only cycles amongst our input boxes
          // Reference: https://stackoverflow.com/a/64416815
          buildFocusWrap(fieldNode);
        }
      }
    } else {
      // Update text
      if (formatter) {
        content = formatter(content);
      }
      purgeChildren(td);
      td.appendChild(document.createTextNode(content));
    }
  }

  for (let k in gSwitches) {
    let label = gSwitches[k].label;
    let value = gSwitches[k].value;

    let span = document.getElementById(k);
    if (span == null) {
      // Parent (block) element may not have been created, so do nothing
    } else if (span.childNodes.length) {
      // Do nothing.  These switches are user-controlled.
    } else {
      span.appendChild(buildCheckBox(label, value));
    }
  }

  td = document.getElementById("power-grads");
  purgeChildren(td);
  td.innerHTML =
    formatPower(gPowerZone[2]) + " &mdash; [" +
    formatPower(gPowerZone[3]) + " &rarr; " +
    formatPower(gPowerZone[5]) + "] &mdash; " +
    formatPower(gPowerZone[7]);

  td = document.getElementById("burst-grads");
  purgeChildren(td);
  td.innerHTML = "[" +
    formatPower(gPowerBurst.low) + " &rarr; " +
    formatPower(gPowerBurst.high) + "] &mdash; " +
    formatPower(gPowerBurst.dead);

  td = document.getElementById("stepRpm-range");
  purgeChildren(td);
  td.innerHTML =
    formatCadence(Math.min(...gCadenceSchmoo)) +
    " &rarr; " +
    formatCadence(gConfig.cadenceRpm.value) +
    " &rarr; " +
    formatCadence(Math.max(...gCadenceSchmoo));

  td = document.getElementById("toleranceRpm-range");
  purgeChildren(td);
  td.innerHTML =
    formatCadence(gConfig.cadenceRpm.value - gConfig.toleranceRpm.value) +
    " &larr; " +
    formatCadence(gConfig.cadenceRpm.value) +
    " &rarr; " +
    formatCadence(gConfig.cadenceRpm.value + gConfig.toleranceRpm.value);
}

//////////////////////////////////////////////////////////////////////////////

function refresh () {
  calcCfg();
  calcTables();
  buildGearingTable();
  buildPowerTable();
  pushCfg();
}
