//////////////////////////////////////////////////////////////////////////////
// Transmission-related measurements
//////////////////////////////////////////////////////////////////////////////

function calcSpeedFromCadence (cadenceRpm, ratio, tireCircMm) {
  return cadenceRpm / ratio * convertMmToMi(tireCircMm) * 60;
}

function calcCadenceFromSpeed (speedMph, ratio, tireCircMm) {
  return speedMph * ratio / convertMmToMi(tireCircMm) / 60;
}

function calcGearInches (tireCircMm, front, rear) {
  var tireDiameterIn = convertMmToIn(convertCircToRadius(tireCircMm)) * 2;
  return tireDiameterIn * front / rear;
}

function calcGearIndexFromChainringAndCluster (ratioByChainringAndCluster) {
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

