//////////////////////////////////////////////////////////////////////////////
// HTML DOM
//////////////////////////////////////////////////////////////////////////////

function purgeChildren (node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

function cloneNodeArray (a) {
  var b = []
  for (let i = 0; i < a.length; ++i) {
    b[i] = a[i].cloneNode(true)
  }
  return b
}
