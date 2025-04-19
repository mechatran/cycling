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
  low: 745,
  high: 1000,
  dead: 3000,
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

class BikeDriveTrainGrids {
  constructor () {
    // Grids

    this.ratioGridByChainringAndCluster = 
      calcGridFromRowAndColumnHeadings(
        gCogsChainring,
        gCogsCluster,
        (chainringTeeth, clusterTeeth) => clusterTeeth / chainringTeeth
      );

    this.gearInchesGridByChainringAndCluster =
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

    this.gearIndexGridByChainringAndCluster = calcGearIndexGridFromChainringAndCluster(this.ratioGridByChainringAndCluster);

    // Schmoos

    this.ratioSchmoo = [];
    calcGridFromGrids(
      [this.gearIndexGridByChainringAndCluster, this.ratioGridByChainringAndCluster],
      (index, ratio) =>
        (index && ratio) ?
          (this.ratioSchmoo[index - 1] = ratio) :
          undefined
    );
  }
}

class BikeGearingEffortGrids {
  constructor (transmission) {
    // Grids

    this.speedGridByChainringAndCluster =
      calcGridFromGrids(
        [transmission.ratioGridByChainringAndCluster],
        (ratio) =>
          calcSpeedFromCadence(
            gConfig.cadenceRpm.value,
            ratio,
            gConfig.tireCircMm.value
          )
      );

    this.legPowerGridByChainringAndCluster =
      calcGridFromGrids(
        [this.speedGridByChainringAndCluster],
        (speed) =>
          calcLegPowerFromRider(
            speed,
            gConfig.gradePercent.value,
            gConfig.weightTotal.value,
            gConfig.position.choices[gConfig.position.value]
          )
      );

    this.cadenceGridByChainringAndCluster =
      calcGridFromGrids(
        [transmission.ratioGridByChainringAndCluster],
        (ratio) =>
          calcCadenceFromSpeed(
            gConfig.speedMph.value,
            ratio,
            gConfig.tireCircMm.value
          )
      );

    this.legForceGridByChainringAndCluster =
      calcGridFromGrids(
        [this.legPowerGridByChainringAndCluster],
        (power) =>
          calcLegForceFromPower(
            power,
            gConfig.cadenceRpm.value,
            gConfig.crankLength.value
          )
      );

    this.wheelTorqueGridByChainringAndCluster =
      calcGridFromGrids(
        [this.legPowerGridByChainringAndCluster, transmission.ratioGridByChainringAndCluster],
        (power, ratio) =>
          calcWheelTorqueFromPower(
            power,
            gConfig.cadenceRpm.value / ratio,
            gConfig.tireCircMm.value
          )
      );
  }
}

class BikeCadenceEffortGrids {
  constructor (transmission) {
    // Schmoos

    this.cadenceSchmoo = 
      createRangeArray(-3, 3).map(
        (x) => gConfig.cadenceRpm.value + gConfig.stepRpm.value * x
      );

    // Grids

    this.speedGridByCadenceAndRatio =
      calcGridFromRowAndColumnHeadings(
        this.cadenceSchmoo,
        transmission.ratioSchmoo,
        (cadence, ratio) =>
          calcSpeedFromCadence(
            cadence,
            ratio,
            gConfig.tireCircMm.value
          )
      );

    this.legPowerGridByCadenceAndRatio =
      calcGridFromGrids(
        [this.speedGridByCadenceAndRatio],
        (speed) =>
          calcLegPowerFromRider(
            speed,
            gConfig.gradePercent.value,
            gConfig.weightTotal.value,
            gConfig.position.choices[gConfig.position.value]
          )
      );

    this.legForceGridByCadenceAndRatio =
      calcGridFromRowHeadingsAndGrid(
        this.cadenceSchmoo,
        this.legPowerGridByCadenceAndRatio,
        (cadence, power) =>
          calcLegForceFromPower(
            power,
            cadence,
            gConfig.crankLength.value
          )
      );
  }
}

class BikeSpeedEffortGrids {
  constructor (transmission) {
    // Schmoos

    this.speedSchmoo =
      createRangeArray(-3, 3).map(
        (x) => gConfig.speedMph.value + 2.5 * x
      );

    // Grids

    this.cadenceGridBySpeedAndRatio =
      calcGridFromRowAndColumnHeadings(
        this.speedSchmoo,
        transmission.ratioSchmoo,
        (speed, ratio) =>
          calcCadenceFromSpeed(
            speed,
            ratio,
            gConfig.tireCircMm.value
          ),
      );
  }
}

class BikeGradeEffortGrids {
  constructor (transmission) {
    // Schmoos

    this.gradeSchmoo = createRangeArray(0, 11, 2).concat(createRangeArray(12, 20, 4));

    let speedAtGradeSchmoo = 
      this.gradeSchmoo.map(
        (grade) =>
          calcSpeedFromRider(
            gConfig.powerFtp.value,
            grade,
            gConfig.weightTotal.value,
            gConfig.position.choices[gConfig.position.value]
          )
      );


    // Grids

    this.cadenceGridByGradeAndRatio =
      calcGridFromRowAndColumnHeadings(
        speedAtGradeSchmoo,
        transmission.ratioSchmoo,
        (speed, ratio) =>
          boundBy(
            calcCadenceFromSpeed(
              speed,
              ratio,
              gConfig.tireCircMm.value
            ),
            gConfig.cadenceRpmMin.value,
            gConfig.cadenceRpmMax.value
          )
      );

    this.speedGridByGradeAndRatio =
      calcGridFromColumnHeadingsAndGrid(
        transmission.ratioSchmoo,
        this.cadenceGridByGradeAndRatio,
        (ratio, cadence) =>
          calcSpeedFromCadence(
            cadence,
            ratio,
            gConfig.tireCircMm.value
          )
      );

    this.legPowerGridByGradeAndRatio =
      calcGridFromRowHeadingsAndGrid(
        this.gradeSchmoo,
        this.speedGridByGradeAndRatio,
        (grade, speed) =>
          calcLegPowerFromRider(
            speed,
            grade,
            gConfig.weightTotal.value,
            gConfig.position.choices[gConfig.position.value]
          )
      );

    this.legForceGridByGradeAndRatio =
      calcGridFromGrids(
        [this.cadenceGridByGradeAndRatio, this.legPowerGridByGradeAndRatio],
        (cadence, power) =>
          calcLegForceFromPower(
            power,
            cadence,
            gConfig.crankLength.value
          )
      );
  }
}
