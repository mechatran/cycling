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

var gRatioByChainring = [];
var gGearIndexByChainring = [];
var gGearInchesByChainring = [];
var gLegPowerByChainring = [];
var gLegForceByChainring = [];
var gSpeedByChainring = [];
var gCadenceByChainring = [];
var gWheelTorqueByChainring = [];

var gRatioSchmoo = [];
var gCadenceSchmoo = [];
var gGradeSchmoo = [];
var gSpeedSchmoo = [];
var gLegForceByCadence = [];
var gLegPowerByCadence = [];
var gSpeedByCadence = [];
var gCadenceBySpeed = [];
var gCadenceByGrade = [];
var gSpeedByGrade = [];
var gLegForceByGrade = [];
var gLegPowerByGrade = [];

var gConfig = {
  chainrings:    { value: "1,12",               order: 1,  choices: CHAINRINGS },
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
  weightTotal:   { value: 0,                               formatter: formatWeightKg }, // Calculated
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
  gearing_table:         { value: true,  label: "Show"      },
  gearing_indexes:       { value: true,  label: "Indexes"   },
  gearing_inches:        { value: false, label: "Inches"    },
  gearing_ratios:        { value: true,  label: "Ratios"    },
  speedAtCadence_table:  { value: true,  label: "Show"      },
  speedAtCadence_force:  { value: false, label: "Force"     },
  speedAtCadence_power:  { value: true,  label: "Power"     },
  cadenceAtSpeed_table:  { value: false, label: "Show"      },
  torqueAtCadence_table: { value: false, label: "Show"      },
  torqueAtCadence_force: { value: true,  label: "Force"     },
  speedByCadence_table:  { value: true,  label: "Show"      },
  speedByCadence_force:  { value: true,  label: "Force"     },
  speedByCadence_power:  { value: true,  label: "Power"     },
  cadenceBySpeed_table:  { value: false, label: "Show"      },
  speedByGrade_table:    { value: true,  label: "Show"      },
  speedByGrade_cadence:  { value: true,  label: "Cadence"   },
  speedByGrade_force:    { value: true,  label: "Force"     },
  speedByGrade_power:    { value: true,  label: "Power"     },
  powerStripe:           { value: true,  label: "Power"     },
  burstStripe:           { value: true,  label: "Burst"     },
  cadenceStripe:         { value: true,  label: "Cadence"   },
  blending:              { value: true,  label: "Blending"  },
  primaryUnits:          { value: true,  label: "Primary"   },
  secondaryUnits:        { value: true,  label: "Secondary" },
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

function calcRatioByChainring (cogsChainring, cogsCluster) {
  var ratioByChainring = []
  for (let i = 0; i < cogsChainring.length; ++i) {
    ratioByChainring[i] = [];
    for (let j = 0; j < cogsCluster.length; ++j) {
      ratioByChainring[i][j] = cogsCluster[j] / cogsChainring[i];
    }
  }
  return ratioByChainring;
}

function calcGearInchesByChainring (cogsChainring, cogsCluster) {
  var gearInchesByChainring = [];
  for (let i = 0; i < cogsChainring.length; ++i) {
    gearInchesByChainring[i] = [];
    for (let j = 0; j < cogsCluster.length; ++j) {
      gearInchesByChainring[i][j] =
        calcGearInches(
          gConfig.tireCircMm.value,
          cogsChainring[i],
          cogsCluster[j]);
    }
  }
  return gearInchesByChainring;
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

function calcPowerFromSpeed (speeds, grades=undefined) {
  var powerByChainring = [];
  for (let i = 0; i < speeds.length; ++i) {
    powerByChainring[i] = [];
    for (let j = 0; j < speeds[i].length; ++j) {
      powerByChainring[i][j] =
        calcLegPowerFromRider(
          speeds[i][j],
          grades ? grades[i] : gConfig.gradePercent.value,
          gConfig.weightTotal.value,
          gConfig.position.choices[gConfig.position.value]);
    }
  }
  return powerByChainring;
}

function calcForceByChainring (powerByChainring) {
  var forceByChainring = [];
  for (let i = 0; i < powerByChainring.length; ++i) {
    forceByChainring[i] = [];
    for (let j = 0; j < powerByChainring[i].length; ++j) {
      forceByChainring[i][j] =
        calcLegForceFromPower(
          powerByChainring[i][j],
          gConfig.cadenceRpm.value,
          gConfig.crankLength.value);
    }
  }
  return forceByChainring;
}

function calcCadenceByChainring (ratioByChainring) {
  var cadenceByChainring = [];
  for (let i = 0; i < ratioByChainring.length; ++i) {
    cadenceByChainring[i] = [];
    for (let j = 0; j < ratioByChainring[i].length; ++j) {
      cadenceByChainring[i][j] =
        calcCadence(
          gConfig.speedMph.value,
          ratioByChainring[i][j],
          gConfig.tireCircMm.value);
    }
  }
  return cadenceByChainring;
}

function calcSpeedByChainring (ratioByChainring) {
  var speedByChainring = [];
  for (let i = 0; i < ratioByChainring.length; ++i) {
    speedByChainring[i] = [];
    for (let j = 0; j < ratioByChainring[i].length; ++j) {
      speedByChainring[i][j] =
        calcSpeed(
          gConfig.cadenceRpm.value,
          ratioByChainring[i][j],
          gConfig.tireCircMm.value);
    }
  }
  return speedByChainring;
}

function calcWheelTorqueByChainring (powerByChainring, ratioByChainring) {
  var wheelTorqueByChainring = []
  for (let i = 0; i < powerByChainring.length; ++i) {
    wheelTorqueByChainring[i] = [];
    for (let j = 0; j < powerByChainring[i].length; ++j) {
      wheelTorqueByChainring[i][j] =
        calcWheelTorque(
          powerByChainring[i][j],
          gConfig.cadenceRpm.value / ratioByChainring[i][j],
          gConfig.tireCircMm.value);
    }
  }
  return wheelTorqueByChainring;
}

function calcCadenceSchmoo () {
  var cadences = [];
  for (let i = -3; i <= 3; ++i) {
    cadences.push(gConfig.cadenceRpm.value + gConfig.stepRpm.value * i);
  }
  return cadences;
}

function calcRatioSchmoo (gearIndexByChainring, ratioByChainring) {
  var ratios = [];
  for (let i = 1; i <= ratioByChainring.length * ratioByChainring[0].length; ++i) {
    let r = lookup(i, gearIndexByChainring, ratioByChainring);
    if (!r) {
      break;
    }
    ratios.push(r);
  }
  return ratios;
}

function calcSpeedSchmoo () {
  var speeds = [];
  for (let i = -3; i <= 3; ++i) {
    speeds.push(gConfig.speedMph.value + 2.5 * i);
  }
  return speeds;
}

function calcGradeSchmoo () {
  var grades = [];
  for (let i = 0; i < 12; i += 2) {
    grades.push(i);
  }
  for (let i = 12; i <= 20; i += 4) {
    grades.push(i);
  }
  return grades;
}

function calcForceByCadence (cadences, powerByCadence) {
  var isCadenceGrid = (cadences instanceof Array) && (cadences[0] instanceof Array);
  var forceByCadence = [];
  for (let i = 0; i < cadences.length; ++i) {
    forceByCadence[i] = [];
    for (let j = 0; j < powerByCadence[i].length; ++j) {
      forceByCadence[i][j] =
        calcLegForceFromPower(
          powerByCadence[i][j],
          isCadenceGrid ? cadences[i][j] : cadences[i],
          gConfig.crankLength.value);
    }
  }
  return forceByCadence;
}

function calcSpeedByCadence (cadences, ratios) {
  var isCadenceGrid = (cadences instanceof Array) && (cadences[0] instanceof Array);
  var speedByCadence = [];
  for (let i = 0; i < cadences.length; ++i) {
    speedByCadence[i] = [];
    for (let j = 0; j < ratios.length; ++j) {
      speedByCadence[i][j] =
        calcSpeed(
          isCadenceGrid ? cadences[i][j] : cadences[i],
          ratios[j],
          gConfig.tireCircMm.value);
    }
  }
  return speedByCadence;
}

function calcCadenceBySpeed (speeds, ratios, min=0, max=0) {
  var cadenceBySpeed = [];
  for (let i = 0; i < speeds.length; ++i) {
    cadenceBySpeed[i] = [];
    for (let j = 0; j < ratios.length; ++j) {
      let cadence =
        calcCadence(
          speeds[i],
          ratios[j],
          gConfig.tireCircMm.value);
      if (min) {
        cadence = Math.max(cadence, min);
      }
      if (max) {
        cadence = Math.min(cadence, max);
      }
      cadenceBySpeed[i][j] = cadence;
    }
  }
  return cadenceBySpeed;
}

function calcSpeedByGradeSchmoo (grades) {
  var speedbyGrade = [];
  for (let i = 0; i < grades.length; ++i) {
    speedbyGrade[i] =
      calcSpeedFromRider(
        gConfig.powerFtp.value,
        grades[i],
        gConfig.weightTotal.value,
        gConfig.position.choices[gConfig.position.value]);
  }
  return speedbyGrade;
}

function calcTables () {
  // NOTE: We need to control the calculation order to resolve dependencies
  //       between calculation steps.  Pass the global tables to each helper
  //       function as an argument to help make this clear.  Configuration
  //       parameters are accessed via gConfig because those values are fixed
  //       ahead of time.

  gRatioByChainring = calcRatioByChainring(gCogsChainring, gCogsCluster);
  gGearInchesByChainring = calcGearInchesByChainring(gCogsChainring, gCogsCluster);
  gGearIndexByChainring = calcGearIndexByChainring(gRatioByChainring);

  gSpeedByChainring = calcSpeedByChainring(gRatioByChainring);
  gLegPowerByChainring = calcPowerFromSpeed(gSpeedByChainring);
  gCadenceByChainring = calcCadenceByChainring(gRatioByChainring);
  gLegForceByChainring = calcForceByChainring(gLegPowerByChainring);
  gWheelTorqueByChainring = calcWheelTorqueByChainring(gLegPowerByChainring, gRatioByChainring);

  gCadenceSchmoo = calcCadenceSchmoo();
  gRatioSchmoo = calcRatioSchmoo(gGearIndexByChainring, gRatioByChainring);

  gSpeedByCadence = calcSpeedByCadence(gCadenceSchmoo, gRatioSchmoo);
  gLegPowerByCadence = calcPowerFromSpeed(gSpeedByCadence);
  gLegForceByCadence = calcForceByCadence(gCadenceSchmoo, gLegPowerByCadence);

  gSpeedSchmoo = calcSpeedSchmoo();

  gCadenceBySpeed = calcCadenceBySpeed(gSpeedSchmoo, gRatioSchmoo);

  gGradeSchmoo = calcGradeSchmoo();

  let speedByGradeSchmoo = calcSpeedByGradeSchmoo(gGradeSchmoo);
  gCadenceByGrade = calcCadenceBySpeed(speedByGradeSchmoo, gRatioSchmoo, gConfig.cadenceRpmMin.value, gConfig.cadenceRpmMax.value); // TOOD: gConfig
  gSpeedByGrade = calcSpeedByCadence(gCadenceByGrade, gRatioSchmoo);
  gLegPowerByGrade = calcPowerFromSpeed(gSpeedByGrade, gGradeSchmoo);
  gLegForceByGrade = calcForceByCadence(gCadenceByGrade, gLegPowerByGrade);
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
      "<li>Index" +
      "<li>Gear Inches" +
      "<li>Ratio (Front &divide; Rear)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.gearing_indexes.value, gGearIndexByChainring, formatNone, false],
      [gSwitches.gearing_inches.value, gGearInchesByChainring, formatGearInches, true],
      [gSwitches.gearing_ratios.value, gRatioByChainring, formatRatio, true]]);
    let [nums, inches, ratios] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    if (nums >= 0) {
      colorGridByGearIndex(cells[nums], gGearIndexByChainring, gGearIndexByChainring);
      formatGearIndexCells(cells[nums]);
    }
    if (inches >= 0) {
      colorRatioGridConditionally(cells[inches], gGearIndexByChainring);
      colorGridsByRatio([cells[inches]], gRatioByChainring);
    }
    if (ratios >= 0) {
      colorRatioGridConditionally(cells[ratios], gGearIndexByChainring);
      colorGridsByRatio([cells[ratios]], gRatioByChainring);
    }
    formatCellGridsGroupsConditionally(cells, gGearIndexByChainring);
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
      "<li>Leg Force (lbf)" +
      "<li>Leg Power (Watt)" +
      "<li>Speed (MPH)" +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.cadenceRpm.value + " RPM" +
      "</ul>" +
      "<div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedAtCadence_force.value, gLegForceByChainring, formatForce, false],
      [gSwitches.speedAtCadence_power.value, gLegPowerByChainring, formatPower, false],
      [true, gSpeedByChainring, formatSpeed, true]]);
    let [force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByChainring);
    colorGridsByPowerZone(cells, gLegPowerByChainring);
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
      [true, gCadenceByChainring, formatCadence, true]]);

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsByCadence(cells, gCadenceByChainring);
    colorGridsByCadenceZone(cells, gCadenceByChainring);
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
      "<li>Leg Force (lbf)" +
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
      [gSwitches.torqueAtCadence_force.value, gLegForceByChainring, formatForce, false],
      [true, gWheelTorqueByChainring, formatTorque, true]]);
    let [force] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsByWheelTorque(cells, gWheelTorqueByChainring);
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
  colorGridByGearIndex(cells[0], [gearNumbers], gGearIndexByChainring);

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
      "<li>Leg Force (lbf)" +
      "<li>Leg Power (Watt)" +
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
      [gSwitches.speedByCadence_force.value, gLegForceByCadence, formatForce, false],
      [gSwitches.speedByCadence_power.value, gLegPowerByCadence, formatPower, false],
      [true, gSpeedByCadence, formatSpeed, true]]);
    let [force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByCadence);
    colorGridsByPowerZone(cells, gLegPowerByCadence);
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
      [true, gCadenceBySpeed, formatCadence, true]]);

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters)
    colorGridsByCadence(cells, gCadenceBySpeed);
    colorGridsByCadenceZone(cells, gCadenceBySpeed);
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
      "<li>Cadence (" + gConfig.cadenceRpmMin.value + " &ndash; " + gConfig.cadenceRpmMax.value + " RPM)" +
      "<li>Leg Force (lbf)" +
      "<li>Leg Power (Watt)" +
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
      [gSwitches.speedByGrade_cadence.value, gCadenceByGrade, formatCadence, false],
      [gSwitches.speedByGrade_force.value, gLegForceByGrade, formatForce, false],
      [gSwitches.speedByGrade_power.value, gLegPowerByGrade, formatPower, false],
      [true, gSpeedByGrade, formatSpeed, true]]);
    let [cadence, force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByGrade);
    colorGridsByPowerZone(cells, gLegPowerByGrade);
    colorGridsByCadenceZone(cells, gCadenceByGrade, false);
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
    if (span.childNodes.length) {
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
  pushCfg();
  buildGearingTable();
  buildPowerTable();
}
