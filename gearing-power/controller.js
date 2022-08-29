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
  let transmission = new GearingTransmission();
  let effort = new GearingEffort(transmission);
  calcTables(transmission);
  buildGearingTable(transmission, effort);
  buildPowerTable(transmission);
  pushCfg();
}
