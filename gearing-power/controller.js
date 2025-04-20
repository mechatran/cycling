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
  cadenceStripe:         { value: true,  label: "C.Pref"           },
  blending:              { value: true,  label: "Blending"         },
  primaryUnits:          { value: true,  label: "Primary"          },
  secondaryUnits:        { value: true,  label: "Secondary"        },
}

//////////////////////////////////////////////////////////////////////////////

function pushCfg (cadence) {
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

  var powerFields = [
    { id: "powerZ6-end", value: gPowerZone[7] },
    { id: "burstLow", value: gPowerBurst.low },
    { id: "burstHigh", value: gPowerBurst.high },
    { id: "burstDead", value: gPowerBurst.dead },
  ]

  for (let field of powerFields) {
    td = document.getElementById(field.id);
    purgeChildren(td);
    td.innerHTML = formatPower(field.value);
  }

  td = document.getElementById("stepRpm-range");
  purgeChildren(td);
  td.innerHTML =
    Math.min(...cadence.cadenceSchmoo) +
    " &ndash; " +
    formatCadence(Math.max(...cadence.cadenceSchmoo));

  td = document.getElementById("toleranceRpm-range");
  purgeChildren(td);
  td.innerHTML =
    (gConfig.cadenceRpm.value - gConfig.toleranceRpm.value) +
    " &ndash; " +
    formatCadence(gConfig.cadenceRpm.value + gConfig.toleranceRpm.value);
}

//////////////////////////////////////////////////////////////////////////////

function refresh () {
  calcCfg();
  let driveTrain = new BikeDriveTrainGrids();
  let gearingEffort = new BikeGearingEffortGrids(driveTrain);
  let cadenceEffort = new BikeCadenceEffortGrids(driveTrain);
  let speedEffort = new BikeSpeedEffortGrids(driveTrain);
  let gradeEffort = new BikeGradeEffortGrids(driveTrain);
  buildGearingTable(driveTrain, gearingEffort);
  buildPowerTable(driveTrain, cadenceEffort, speedEffort, gradeEffort);
  pushCfg(cadenceEffort);
}
