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
  return __appendUnits(teeth, units, "T");
}

function formatRatio (ratio, units=true) {
  return __appendUnits(__formatRoundedTo(ratio, 2), units, ":1");
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

function formatWeightLbAndKg (weight, units=true) {
  return formatWeightLb(convertKgToLb(weight), units) + " / " + formatWeightKg(weight, units)
}

function formatWeightG (weight, units=true) {
  return __appendUnits(__formatRoundedTo(weight, 0), units, " g");
}

function formatPercent (p, units=true) {
  return __appendUnits(__formatRoundedTo(p, 1), units, "%");
}

function formatFitness (fitness, units=true) {
  return __appendUnits(__formatRoundedTo(fitness, 1), units, " W/kg");
}
