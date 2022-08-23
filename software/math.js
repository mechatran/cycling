//////////////////////////////////////////////////////////////////////////////
// Math
//////////////////////////////////////////////////////////////////////////////

function roundTo (n, places) {
  var factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
}

function boundBy (n, min, max) {
  if (min) {
    n = Math.max(n, min);
  }
  if (max) {
    n = Math.min(n, max);
  }
  return n;
}
