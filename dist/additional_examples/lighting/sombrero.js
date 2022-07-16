"use strict";

var sombreroData = function(ROWS, COLUMNS){
  var data = [];
  var x0 = -2, dx = 4 / ROWS;
  var z0 = -2, dz = 4 / COLUMNS;
  for(var i = 0; i < ROWS; i++) {
    var x = x0 + dx * i;
    for(var j = 0; j < COLUMNS; j++) {
      var z = z0 + dz * j;
      var r = Math.sqrt(x * x + z * z);
      data.push(r ? Math.sin(Math.PI * r) / (Math.PI * r) : 1.0);
    }
  }
  
  return data;
}

function sombrero(ROWS, COLUMNS){
  var data = sombreroData(ROWS, COLUMNS);
  var vertices = [], n_out = [];
  var x0 = -2, dx = 4 / ROWS;
  var y0 = -1;
  var z0 = -2, dz = 4 / COLUMNS;
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
    type: "sombrero",
    eye: [-.2, .3, .3], 
    at: [0, 0, 0], up: [0, 1, 0],
    axis: [.12, .2, 0], 
    theta: .5, 
    translate: [0, .5, 0], 
    scale: [1, 1, 1], 
    ortho: [-1.5, 1.5, -1.5, 1.5, -1.5, 1.5] 
  };
}
 