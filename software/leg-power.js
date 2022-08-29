const AERO_BY_POSITION = {
  // https://www.cyclingpowerlab.com/CyclingAerodynamics.aspx
  tops:    { c_d: 1.15, A: 0.632 },
  hoods:   { c_d: 1.00, A: 0.400 },
  drops:   { c_d: 0.88, A: 0.320 },
  // https://www.gribble.org/cycling/power_v_speed.html
  gribble: { c_d: 0.63, A: 0.509 },
};

const PHYS = {
  mph_to_mps: (1.609344 * 1000) / (60 * 60), // Units: m/s
  mps_to_mph: (60 * 60) / (1.609344 * 1000), // Units: mi/h
  g: 9.80665,                                // Gravity (Units: m/s^2)
  rho: 1.226,                                // Air density (Units: kg/m^3)
  loss_dt: 0.03,                             // Drivetrain loss
  c_rr: 0.005,                               // Coefficient of rolling resistence
  lbf_to_N: 4.4482216152605,                 // Units: N
  m_to_mm: 1000,                             // Units: mm
  rps_to_rpm: 60                             // Units: RPM
};

// This implements the physics math from https://www.gribble.org/cycling/power_v_speed.html
function calcLegPowerFromRider (speedMph, gradePercent, weightKg, position) {
  position = position.toLowerCase();

  const c = {
    c_d: AERO_BY_POSITION[position].c_d,       // Coefficient of drag
    A: AERO_BY_POSITION[position].A,           // Frontal area (Units: m^2)
  };

  // f_* Units: N
  // p_* Units: W
  var grade = gradePercent / 100;
  var speedMps = speedMph * PHYS.mph_to_mps;
  var f_gravity = PHYS.g * Math.sin(Math.atan(grade)) * weightKg;
  var f_rolling = PHYS.g * Math.cos(Math.atan(grade)) * weightKg * PHYS.c_rr;
  var f_drag = 0.5 * c.c_d * c.A * PHYS.rho * Math.pow(speedMps, 2);
  var p_wheels = (f_gravity + f_rolling + f_drag) * (speedMps);
  var p_legs = p_wheels / (1 - PHYS.loss_dt);

  if (isNaN(p_legs) || (p_legs < 0)) {
    return 0;
  } else {
    return p_legs;
  }
}

// This implements the conversion between power and torque from https://en.wikipedia.org/wiki/Torque#Conversion_to_other_units
function calcLegForceFromPower (power, cadenceRpm, crankLength) {
  const c = {
  }
  var cadenceRps = cadenceRpm / PHYS.rps_to_rpm;     // Units: RPM --> rev/s
  var torque = power / ((2 * Math.PI) * cadenceRps); // Units: N*m
  var lever = crankLength / PHYS.m_to_mm;            // Units: mm --> m
  var force = torque / lever;                        // Units: N
  return force / PHYS.lbf_to_N;                      // Units: N --> lbf
}

// https://www.1728.org/cubic2.htm
function __solveCubic (a, b, c, d) {
  var a2 = Math.pow(a, 2);
  var a3 = Math.pow(a, 3);
  var b2 = Math.pow(b, 2);
  var b3 = Math.pow(b, 3);
  var c2 = Math.pow(c, 2);
  var c3 = Math.pow(c, 3);
  var d2 = Math.pow(d, 2);
  var f = ((3 * c / a) - (b2 / a2)) / 3;
  var f3 = Math.pow(f, 3);
  var g = ((2 * b3 / a3) - (9 * b * c / a2) + (27 * d / a)) / 27;
  var g2 = Math.pow(g, 2);
  var h = (g2 / 4) + (f3 / 27);
  if (h > 0) {
    // One real root
    var R = -(g / 2) + Math.pow(h, 1/2);
    var S = Math.pow(R, 1/3);
    var T = -(g / 2) - Math.pow(h, 1/2);
    // NOTE: This code was originally written for Google Sheets, which does not
    //       like taking the cube root of a negative number.  So, we negate T
    //       to make it positive, then negate U to compensate.
    var sign = (T < 0) ? -1 : 1;
    var U = sign * Math.pow(sign * T, 1/3);
    return (S + U) - (b / (3 * a));
  } else if (f == 0 && g == 0 && h == 0) {
    // Triple root
    return Math.pow(d / a, 1/3) * -1;
  } else if (h <= 0) {
    // Three real roots
    var i = Math.pow((g2 / 4) - h, 1/2);
    var j = Math.pow(i, 1/3)
    var k = Math.acos(-(g / (2 * i)));
    var L = j * -1;
    var M = Math.cos(k / 3);
    var N = Math.sqrt(3) * Math.sin(k / 3);
    var P = (b / (3 * a)) * -1;
    var x1 = (2 * j) * Math.cos(k / 3) - (b / (3 * a));
    var x2 = L * (M + N) + P;
    var x3 = L * (M - N) + P;
    return Math.max(x1, x2, x3);
  }
}

// The inverse of calcLegPowerFromRider()
function calcSpeedFromRider (p_legs, gradePercent, weightKg, position) {
  position = position.toLowerCase();

  const c = {
    c_d: AERO_BY_POSITION[position].c_d, // Coefficient of drag
    A: AERO_BY_POSITION[position].A,     // Frontal area (Units: m^2)
  };

  // f_* Units: N
  // p_* Units: W
  var grade = gradePercent / 100;
  var p_wheels = p_legs * (1 - PHYS.loss_dt);
  var f_gravity = PHYS.g * Math.sin(Math.atan(grade)) * weightKg;
  var f_rolling = PHYS.g * Math.cos(Math.atan(grade)) * weightKg * PHYS.c_rr;
  var coeff = {
    a: 0.5 * c.c_d * c.A * PHYS.rho, // ... * speed^3
    b: 0,                            // ... * speed^2
    c: f_gravity + f_rolling,        // ... * speed^1
    d: -p_wheels,                    // ... * speed^0
  }
  //return coeff.a + " " + coeff.b + " " + coeff.c + " " + coeff.d;
  return __solveCubic(coeff.a, coeff.b, coeff.c, coeff.d) * PHYS.mps_to_mph;
}

// Torque at wheel after transmission
function calcWheelTorqueFromPower (power, wheelRpm, tireCircMm) {
  var tireRadiusMm = convertCircToRadius(tireCircMm);
  var tireRadiusFt = tireRadiusMm / 25.4 / 12;
  return calcLegForceFromPower(power, wheelRpm, tireRadiusMm) * tireRadiusFt;
}
