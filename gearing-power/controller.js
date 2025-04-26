var gSwitches = {
  tableSelection_table:  { value: true,  label: "Table Selection",    handler: handlePanelCheckBox, target: "tableSelection-panel", },
  displayOptions_table:  { value: true,  label: "Display Options",    handler: handlePanelCheckBox, target: "displayOptions-panel", },
  bikeProfile_table:     { value: true,  label: "Bike Profile",       handler: handlePanelCheckBox, target: "bikeProfile-panel",    },
  simProfile_table:      { value: true,  label: "Simulation Profile", handler: handlePanelCheckBox, target: "simProfile-panel",     },
  cadenceProfile_table:  { value: true,  label: "Cadence Profile",    handler: handlePanelCheckBox, target: "cadenceProfile-panel", },
  powerProfile_table:    { value: true,  label: "Power Profile",      handler: handlePanelCheckBox, target: "powerProfile-panel",   },
  orientationVertical:   { value: true,  label: "Vertical",           handler: handleOrientationCheckbox },
  gearing_table:         { value: true,  label: "Show",               handler: handleCheckBox },
  gearing_indexes:       { value: true,  label: "Index",              handler: handleCheckBox },
  gearing_speed:         { value: true,  label: "Speed (MPH)",        handler: handleCheckBox },
  gearing_inches:        { value: true,  label: "Gear Inches",        handler: handleCheckBox },
  speedAtCadence_table:  { value: false, label: "Show",               handler: handleCheckBox },
  speedAtCadence_force:  { value: true,  label: "Leg Force (lbf)",    handler: handleCheckBox },
  speedAtCadence_power:  { value: true,  label: "Leg Power (Watt)",   handler: handleCheckBox },
  cadenceAtSpeed_table:  { value: false, label: "Show",               handler: handleCheckBox },
  torqueAtCadence_table: { value: false, label: "Show",               handler: handleCheckBox },
  torqueAtCadence_force: { value: true,  label: "Leg Force (lbf)",    handler: handleCheckBox },
  speedByCadence_table:  { value: true,  label: "Show",               handler: handleCheckBox },
  speedByCadence_force:  { value: true,  label: "Leg Force (lbf)",    handler: handleCheckBox },
  speedByCadence_power:  { value: true,  label: "Leg Power (Watt)",   handler: handleCheckBox },
  cadenceBySpeed_table:  { value: false, label: "Show",               handler: handleCheckBox },
  speedByGrade_table:    { value: true,  label: "Show",               handler: handleCheckBox },
  speedByGrade_cadence:  { value: true,  label: "Cadence",            handler: handleCheckBox },
  speedByGrade_force:    { value: true,  label: "Leg Force (lbf)",    handler: handleCheckBox },
  speedByGrade_power:    { value: true,  label: "Leg Power (Watt)",   handler: handleCheckBox },
  powerStripe:           { value: true,  label: "Power Zones",        handler: handleCheckBox },
  burstStripe:           { value: true,  label: "Burst",              handler: handleCheckBox },
  cadenceStripe:         { value: true,  label: "C.Pref",             handler: handleCheckBox },
  blending:              { value: true,  label: "Blending",           handler: handleCheckBox },
  primaryUnits:          { value: true,  label: "Primary",            handler: handleCheckBox },
  secondaryUnits:        { value: true,  label: "Secondary",          handler: handleCheckBox },
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
    let span = document.getElementById(k);
    if (span && span.childNodes.length == 0) {
      span.appendChild(buildCheckBox(gSwitches[k].label, gSwitches[k].value, gSwitches[k].handler));
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

  td = document.getElementById("cadenceRpm-range");
  purgeChildren(td);
  td.innerHTML =
    gConfig.cadenceRpmMin.value +
    " &ndash; " +
    formatCadence(gConfig.cadenceRpmMax.value);
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
