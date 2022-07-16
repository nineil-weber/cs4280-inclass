"use strict";

var mix = function(a, b, n){
  return [
    (1 - n) * a[0] + n * b[0],
    (1 - n) * a[1] + n * b[1],
    (1 - n) * a[2] + n * b[2],
  ];
}

var normalize = function(v){
  var len = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    return [v[0] * len, v[1] * len, v[2] * len];
  }
}

var divideTriangle = function(v_out, a, b, c, count) {
  if ( count > 0 ) {
    var ab = mix( a, b, 0.5);
    var ac = mix( a, c, 0.5);
    var bc = mix( b, c, 0.5);

    ab = normalize(ab);
    ac = normalize(ac);
    bc = normalize(bc);

    divideTriangle(v_out, a, ab, ac, count - 1);
    divideTriangle(v_out, ab, b, bc, count - 1);
    divideTriangle(v_out, ac, bc, c, count - 1);
    divideTriangle(v_out, ab, bc, ac, count - 1);
  }
  else {
    v_out.push.apply(v_out, [].concat(a).concat(b).concat(c));
  }
}

var divideTetrahedron = function(v_out, a, b, c, d, n) {
  divideTriangle(v_out, a, b, c, n);
  divideTriangle(v_out, a, b, d, n);
  divideTriangle(v_out, a, c, d, n);
  divideTriangle(v_out, b, c, d, n);
}

function sphere2(COUNT){
  var vertices = []; 
  var va = [0.0, 0.0, 1.0];
  var vb = [0.0, 0.942809, -0.333333];
  var vc = [-0.816497, -0.471405, -0.333333];
  var vd = [0.816497, -0.471405, -0.333333];
  
  divideTetrahedron(vertices, va, vb, vc, vd, COUNT);

  return { 
    vertices: vertices, 
    normals: vertices, 
    type: "sphere2",
    eye: [-.2, .3, .3], 
    at: [0, 0, 0], 
    up: [0, 1, 0],
    axis: [.2, .2, .2], 
    theta: 1, 
    translate: [0, 0, 0], 
    scale: [.7, .7, .7], 
    ortho: [-1, 1, -1, 1, -1, 1] 
  };
}
