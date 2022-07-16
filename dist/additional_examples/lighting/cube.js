"use strict";

var face = function(v_out, n_out, uv, a, b, c, d){
  var va = [uv[ 3 * a], uv[ 3 * a + 1], uv[ 3 * a + 2]];
  var vb = [uv[ 3 * b], uv[ 3 * b + 1], uv[ 3 * b + 2]];
  var vc = [uv[ 3 * c], uv[ 3 * c + 1], uv[ 3 * c + 2]];
  var vd = [uv[ 3 * d], uv[ 3 * d + 1], uv[ 3 * d + 2]];
  
  v_out.push.apply(v_out, [].concat(va).concat(vb).concat(vc).
      concat(va).concat(vc).concat(vd));
  n_out.push.apply(n_out, rectangleNormals(va, vb, vc, vd));
}

function cube(){
  var uniq_vertices = [ 
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5, 
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5, 
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5
  ];
  
  var v_out = [];
  var n_out = [];
  
  face(v_out, n_out, uniq_vertices, 0, 1, 2, 3); // front
  face(v_out, n_out, uniq_vertices, 4, 5, 6, 7); // back
  face(v_out, n_out, uniq_vertices, 1, 5, 4, 0); // botton
  face(v_out, n_out, uniq_vertices, 2, 6, 7, 3); // top
  face(v_out, n_out, uniq_vertices, 1, 5, 6, 2); // right
  face(v_out, n_out, uniq_vertices, 0, 4, 7, 3); // left
  
  return { 
    vertices: v_out, 
    normals: n_out, 
    type: "cube", 
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
