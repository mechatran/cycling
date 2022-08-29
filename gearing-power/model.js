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

function calcGearIndexByChainringAndCluster (ratioByChainringAndCluster) {
  function nominal (n) {
    return roundTo(n, 2);
  }

  function calc1x (ratios) {
    return DataGrid.fromArray([createRangeArray(1, ratios.width)]);
  }

  function calc2x (ratios) {
    var gear = DataGrid.fromSimilarGrid(ratios);
    var numGears = 0;

    let margin
    let cutoff;

    if (ratios.width <= 1) {
      margin = 0;
    } else if (ratios.width <= 8) {
      margin = 1;
    } else if (ratios.width <= 10) {
      margin = 2;
    } else {
      margin = 4;
    }

    // Small chainring: uses the first half of the cluster
    for (let column = 0; column < ratios.width - margin; ++column) {
      gear[0][column] = ++numGears;
    }
    cutoff = nominal(ratios[0][numGears - 1]);

    // Big chainring: uses the remaining gear ratios
    for (let column = 0; column < ratios.width; ++column) {
      if (nominal(ratios[1][column]) < cutoff) {
        gear[1][column] = ++numGears;
      }
    }

    return gear;
  }

  function calc3x (ratios) {
    var gear = DataGrid.fromSimilarGrid(ratios);
    var numGears = 0;

    let margin;
    let cutoff, cutoff2;

    // Middle chainring won't use the ends of the cluster
    if (ratios.width <= 1) {
      margin = 0;
    } else if (ratios.width <= 8) {
      margin = 1;
    } else {
      margin = 2;
    }
    cutoff = nominal(ratios[1][margin]);
    cutoff2 = nominal(ratios[1][ratios.width - margin - 1]);

    // Middle chainring: reserve the interior ratios
    for (let column = margin; column < ratios.width - margin; ++column) {
      gear[1][column] = true;
    }

    // Small chainring: reserve the higher ratios
    for (let column = 0; column < ratios.width; ++column) {
      if (nominal(ratios[0][column]) > cutoff) {
        gear[0][column] = true;
      }
    }

    // Big chainring: reserve the lower ratios
    for (let column = 0; column < ratios.width; ++column) {
      if (nominal(ratios[2][column]) < cutoff2) {
        gear[2][column] = true;
      }
    }

    // Assign gear indexes to the reserved elements
    // NOTE: This is a separate step since we did the reservations out of sequence
    for (let row = 0; row < ratios.height; ++row) {
      for (let column = 0; column < ratios.width; ++column) {
        if (gear[row][column]) {
          gear[row][column] = ++numGears;
        }
      }
    }

    return gear;
  }

  switch (ratioByChainringAndCluster.length) {
    case 1:
      return calc1x(ratioByChainringAndCluster);
    case 2:
      return calc2x(ratioByChainringAndCluster);
    case 3:
      return calc3x(ratioByChainringAndCluster);
    default:
      return;
  }
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

  gGearIndexByChainringAndCluster = calcGearIndexByChainringAndCluster(gRatioByChainringAndCluster);

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

