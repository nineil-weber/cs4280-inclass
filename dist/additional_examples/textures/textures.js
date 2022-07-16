"use strict";

function checkerboard(size, R_DIVS, C_DIVS){
  var texels = new Uint8Array(4 * size * size);
  var dx = size / R_DIVS, dy = size / C_DIVS;
  for (var i = 0; i < size; ++i) {
    var cx = Math.floor(i / dx);
    for (var j = 0; j < size; ++j) {
      var cy = Math.floor(j / dx);
      var c = (cx % 2 !== cy % 2 ? 255 : 0);
      texels[4 * i * size + 4 * j] = c; 
      texels[4 * i * size + 4 * j + 1] = c; 
      texels[4 * i * size + 4 * j + 2] = c; 
      texels[4 * i * size + 4 * j + 3] = 255; 
    }
  }
  
  return texels;
}
function sinusoidal(size){
  var texels = new Uint8Array(4 * size * size);
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < size; ++j) {
      var c = 127 + 127 * Math.sin(0.1 * i * j);
      texels[4 * i * size + 4 * j] = c;
      texels[4 * i * size + 4 * j + 1] = c;
      texels[4 * i * size + 4 * j + 2] = c;
      texels[4 * i * size + 4 * j + 3] = 255;
    }
  }
  
  return texels;
}

