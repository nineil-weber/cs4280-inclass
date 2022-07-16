"use strict";

function honolulu(ROWS, COLUMNS){
  var data = ROWS == 128 ? data128 : (ROWS == 64 ? data64 : data256);
  var vertices = [], n_out = [];
  var x0 = -1, dx = 2 / ROWS;
  var y0 = -1;
  var z0 = -1, dz = 2 / COLUMNS;
  for(var i = 0; i < ROWS; i++) {
    for(var j = 0; j < COLUMNS; j++) {
      var va = [x0 + dx * i, y0 + data[i * ROWS + j], z0 + dz * j];
      var vb = [x0 + dx * (i + 1), y0 + data[(i + 1) * ROWS + j], z0 + dz * j];
      var vc = [x0 + dx * (i + 1), y0 + data[(i + 1) * ROWS + j + 1], z0 + dz * (j + 1)];
      var vd = [x0 + dx * i, y0 + data[i * ROWS + j + 1], z0 + dz * (j + 1)];
      
      vertices.push.apply(vertices, [].concat(va).concat(vb).concat(vc).concat(va).concat(vc).concat(vd));
      n_out.push.apply(n_out, rectangleNormals(va, vb, vc, vd, true));
    }
  }
  
  return {
    vertices: vertices, 
    normals: n_out, 
    type: "honolulu", 
    eye: [-.2, .3, .3], 
    at: [0, 0, 0], 
    up: [0, 1, 0],
    axis: [0, 1, 0], 
    theta: .2, 
    translate: [.7, .5, .5], 
    scale: [1, 1, 1], 
    ortho: [-1, 1, -1, 1, -2.5, 2] 
  };
}