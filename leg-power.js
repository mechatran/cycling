const AERO_BY_POSITION = {
  // https://www.cyclingpowerlab.com/CyclingAerodynamics.aspx
  tops:    { c_d: 1.15, A: 0.632 },
  hoods:   { c_d: 1.00, A: 0.400 },
  drops:   { c_d: 0.88, A: 0.320 },
  // https://www.gribble.org/cycling/power_v_speed.html
  gribble: { c_d: 0.63, A: 0.509 },
};

// This implements the physics math from https://www.gribble.org/cycling/power_v_speed.html
function calcLegPowerFromRider (speedMph, gradePercent, weightKg, position) {
  position = position.toLowerCase();

  const c = {
    mph_to_mps: (1.609344 * 1000) / (60 * 60), // Units: m/s
    g: 9.80665,                                // Gravity (Units: m/s^2)
    loss_dt: 0.03,                             // Drivetrain loss
    rho: 1.226,                                // Air density (Units: kg/m^3)
    c_rr: 0.005,                               // Coefficient of rolling resistence
    c_d: AERO_BY_POSITION[position].c_d,       // Coefficient of drag
    A: AERO_BY_POSITION[position].A,           // Frontal area (Units: m^2)
  };

  // f_* Units: N
  // p_* Units: W
  var grade = gradePercent / 100;
  var speedMps = speedMph * c.mph_to_mps;
  var f_gravity = c.g * Math.sin(Math.atan(grade)) * weightKg;
  var f_rolling = c.g * Math.cos(Math.atan(grade)) * weightKg * c.c_rr;
  var f_drag = 0.5 * c.c_d * c.A * c.rho * Math.pow(speedMps, 2);
  var p_wheels = (f_gravity + f_rolling + f_drag) * (speedMps);
  var p_legs = p_wheels / (1 - c.loss_dt);

  if (isNaN(p_legs) || (p_legs < 0)) {
    return 0;
  } else {
    return p_legs;
  }
}

// This implements the conversion between power and torque from https://en.wikipedia.org/wiki/Torque#Conversion_to_other_units
function calcLegForceFromPower (power, cadenceRpm, crankLength) {
  const c = {
    lbf_to_N: 4.4482216152605, // Units: N
    m_to_mm: 1000,             // Units: mm
    rps_to_rpm: 60             // Units: RPM
  }
  var cadenceRps = cadenceRpm / c.rps_to_rpm;        // Units: RPM --> rev/s
  var torque = power / ((2 * Math.PI) * cadenceRps); // Units: N*m
  var lever = crankLength / c.m_to_mm;               // Units: mm --> m
  var force = torque / lever;                        // Units: N
  return force / c.lbf_to_N;                         // Units: N --> lbf
}
