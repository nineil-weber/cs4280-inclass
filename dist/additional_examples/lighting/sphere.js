"use strict";

var calcVertex = function(i, j, r, ROWS, COLUMNS){
  var theta = Math.PI / ROWS;
  var phi = 2 * Math.PI / COLUMNS;
  return [r * Math.sin(i * theta) * Math.cos(j * phi), 
          r * Math.cos(i * theta), 
          r * Math.sin(i * theta) * Math.sin(j * phi)];
}

function sphere(r, ROWS, COLUMNS){
  var vertices = []; 
  for (var i = 0; i <= ROWS - 1; i++) {
    for (var j = 0; j <= COLUMNS - 1; j++) {
      var va = calcVertex(i, j, r, ROWS, COLUMNS);
      var vb = calcVertex(i + 1, j, r, ROWS, COLUMNS);
      var vc = calcVertex(i + 1, j + 1, r, ROWS, COLUMNS);
      var vd = calcVertex(i, j + 1, r, ROWS, COLUMNS);
      vertices.push.apply(vertices, [].concat(va).concat(vb).concat(vc).concat(va).concat(vc).concat(vd));
    }
  }
  
  return { 
    vertices: vertices, 
    normals: vertices, 
    type: "sphere",
    eye: [-.2, .3, .3], 
    at: [0, 0, 0], 
    up: [0, 1, 0],
    axis: [.2, .2, .2], 
    theta: 1, 
    translate: [0, 0, 0], 
    scale: [1, 1, 1], 
    ortho: [-1, 1, -1, 1, -1, 1] 
  };
}
