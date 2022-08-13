//////////////////////////////////////////////////////////////////////////////
// Unit conversions
//////////////////////////////////////////////////////////////////////////////

function convertLbToKg (weight) {
  return weight / 2.2;
}

function convertKgToLb (weight) {
  return weight * 2.2;
}

function convertMmToIn (length) {
  return length / 25.4;
}

function convertMmToMi (length) {
  return convertMmToIn(length) / 12 / 5280;
}

function convertCircToRadius (length) {
  return length / Math.PI / 2;
}
