"use strict";

var calcVertex = function(i, j, r, ROWS, COLUMNS){
  var v = 2 * Math.PI * j / COLUMNS;
  var u = Math.PI * i / ROWS;
  return [
            r * Math.sin(u) * Math.cos(v),
            r * Math.cos(u),
            r * Math.sin(u) * Math.sin(v)
         ];
}

var calcTexCoords = function(i, j, ROWS, COLUMNS){
  return [j / COLUMNS, i / ROWS];
}

function sphere(r, ROWS, COLUMNS){
  var vertices = []; 
  var t_out = [];
  for (var i = 0; i < ROWS; i++) {
    for (var j = 0; j < COLUMNS; j++) {
      var va = calcVertex(i, j, r, ROWS, COLUMNS);
      var vb = calcVertex(i + 1, j, r, ROWS, COLUMNS);
      var vc = calcVertex(i + 1, j + 1, r, ROWS, COLUMNS);
      var vd = calcVertex(i, j + 1, r, ROWS, COLUMNS);
      
      vertices.push.apply(vertices, [].concat(va).concat(vb).concat(vc).concat(va).concat(vc).concat(vd));
      
      t_out.push.apply(t_out, [].
        concat(calcTexCoords(i, j, ROWS, COLUMNS)).
        concat(calcTexCoords(i + 1, j, ROWS, COLUMNS)).
        concat(calcTexCoords(i + 1, j + 1, ROWS, COLUMNS)).
        concat(calcTexCoords(i, j, ROWS, COLUMNS)).
        concat(calcTexCoords(i + 1, j + 1, ROWS, COLUMNS)).
        concat(calcTexCoords(i, j + 1, ROWS, COLUMNS)));
    }
  }
  
  return { 
    vertices: vertices, 
    normals: vertices, 
    texCoords: t_out,
    type: "sphere",
    eye: [-.2, .3, .3], 
    at: [0, 0, 0], 
    up: [0, 1, 0],
    axis: [0, 1, 0], 
    theta: 1, 
    translate: [0, 0, 0], 
    scale: [1, -1, 1], 
    ortho: [-1, 1, -1, 1, -1, 1] 
  };
}

