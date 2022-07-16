/*
 * File: webgl_helper.js 
 * Description: a helper class for the webgl programs of cs4280
 * Version: 1.0.2
 * Last updated at: Nov 14, 2017
 * By: Abdulmalek Al-Gahmi
 */

// Initializes WebGL
function initWebGL(canvas) {
  var ctx = null;
  ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!ctx) {
    alert("Unable to initialize WebGL; your browser may not support it.");
  }
  
  return ctx;
}

// Creates and compiles a shader
function getShader(gl, kind, script){
  var shader = gl.createShader(kind);
  gl.shaderSource(shader, script);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw (kind == gl.VERTEX_SHADER? "vertex" : "fragment") + " compile error: " + gl.getShaderInfoLog(shader);
  }

  return shader;
}

// Creates and links a program using the given scripts.
function initShaders(gl, vs_script, fs_script){
  var v_shader = getShader(gl, gl.VERTEX_SHADER, vs_script);
  var f_shader = getShader(gl, gl.FRAGMENT_SHADER, fs_script);

  var program = gl.createProgram();
  gl.attachShader(program, v_shader);
  gl.attachShader(program, f_shader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw ("Linking error: " + gl.getProgramInfoLog (program));
  }

  return program;
}

/* Initializes and enables one or more buffers for the given 
   attributes data which is expected to be of the following form:
  
   data[{
     name: "attribute_name",
     size: 3,
     data: vertices array or number of vertices to reserve memory 
           for or undefined if buffer was defined in a previous element,
     indices: indicies array to use with drawElements.
     stride: how many floats in per vertex data,
     offset: at what index within the per vertex 
             data the item's portion of data starts
   }]
*/
function initBuffers(gl, program, data){
  var buffers = {}
  var fSize = Float32Array.BYTES_PER_ELEMENT;
  data.forEach(function(item){
    if(item.data !== undefined){
      // Create the buffer
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      buffers[item.name] = buffer;
      
      if(typeof(item.data) !== 'number'){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item.data), gl.STATIC_DRAW);
      }else{
        gl.bufferData(gl.ARRAY_BUFFER, fSize * item.size * item.data, gl.STATIC_DRAW);
      }
      
      if(item.indices !== undefined){
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(item.indices), gl.STATIC_DRAW); 
      }
    }

    // Get the location of and enable the attribute
    var attribute = gl.getAttribLocation(program, item.name);
    var stride = fSize * (item.stride || 0);
    var offset = fSize * (item.offset || 0);
    gl.vertexAttribPointer(attribute, item.size, gl.FLOAT, false, stride, offset); 
    gl.enableVertexAttribArray(attribute);
  });
  
  program["buffers"] = buffers;
  
  return buffers;
}

/* Reset array buffers initially created by initBuffers() and and resend their data.
  
   data = [{
     name: "attribute_name",
     size: 3,
     data: vertices array or number of vertices to reserve memory 
           for or undefined if buffer was defined in a previous element,
     indices: indicies array to use with drawElements.
     stride: how many floats in per vertex data,
     offset: at what index within the per vertex 
             data the item's portion of data starts
   }]
*/
function resetBuffers(gl, program, data){
  var fSize = Float32Array.BYTES_PER_ELEMENT;
  data.forEach(function(item){
    if(item.data !== undefined){
      gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers[item.name]);
      
      if(typeof(item.data) !== 'number'){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item.data), gl.STATIC_DRAW);
      }else{
        gl.bufferData(gl.ARRAY_BUFFER, fSize * item.size * item.data, gl.STATIC_DRAW);
      }
      
      if(item.indices !== undefined){
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(item.indices), gl.STATIC_DRAW); 
      }
    }

    // Get the location of and enable the attribute
    var attribute = gl.getAttribLocation(program, item.name);
    var stride = fSize * (item.stride || 0);
    var offset = fSize * (item.offset || 0);
    gl.vertexAttribPointer(attribute, item.size, gl.FLOAT, false, stride, offset); 
    gl.enableVertexAttribArray(attribute);
  });
}
/* Loads array ot textures from given generated image arrays.
   images = [{
        size: 64,
        data: checkerboard(64, 8, 8), 
        sampler2D: [gl.TEXTURE0, "texture", 0]
      }]
 */
function loadTextures(gl, program, images) {
  var textures = [];
  images.forEach(function(image){
    var texture = gl.createTexture();
    gl.activeTexture(image.sampler2D[0]);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.size, image.size, 0, 
                  gl.RGBA, gl.UNSIGNED_BYTE, image.data);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
    gl.uniform1i(gl.getUniformLocation(program, image.sampler2D[1]), image.sampler2D[2]);
    textures.push(texture);
  });

  return textures;
}

/* Returns whether or not a given n is power of 2 */
function isPowerOfTwo(n) {
  return (n & (n - 1)) == 0;
}

/* Loads array ot textures from given urls.
   images = [{
      url: 64,
      sampler2D: [gl.TEXTURE0, "texture", 0]
    }]
 */
function loadTexturesFromUrls(gl, program, images) {
  var textures = [];
  images.forEach(function(image){
    var texture = gl.createTexture();
    gl.activeTexture(image.sampler2D[0]);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    var img = new Image();
    img.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                    gl.RGBA, gl.UNSIGNED_BYTE, img);

      if (isPowerOfTwo(img.width) && isPowerOfTwo(img.height)) {
         gl.generateMipmap(gl.TEXTURE_2D);
      } else {
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
    
      gl.uniform1i(gl.getUniformLocation(program, image.sampler2D[1]), image.sampler2D[2]);
    };
    img.src = image.url;
    
    textures.push(texture);
  });
  return textures;
}

// Clears the canvas and sets the background color.
function clear(gl, color){
  gl.clearColor(...color);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Depends on glMatrix vec3 and calculates the normals of
// a triangle polygon made of the unique vertices (a, b, and c).
// The negated argument (if any) is used to flip
// the calculated normals to the opposite direction.
function triangleNormals(a, b, c, negated){
  var ab = vec3.sub(vec3.create(), b, a);
  var bc = vec3.sub(vec3.create(), c, b);
  var cross = vec3.cross(vec3.create(), ab, bc);
  if (negated) cross = vec3.negate(cross, cross);
  var n1 = [cross[0], cross[1], cross[2]];

  return [].concat(n1).concat(n1).concat(n1);
}


// Depends on glMatrix vec3 and calculates the normals of
// a rectangular polygon made of four unique vertices (a, b, c, and d)
// and 2 triangles. The negated argument (if any) is used to flip
// the calculated normals to the opposite direction.
function rectangleNormals(a, b, c, d, negated){
  var n1 = triangleNormals(a, b, c, negated);
  var n2 = triangleNormals(a, c, d, negated);

  return [].concat(n1).concat(n2);
}


// Calculates a floating-point color from a given hexadecimal color.
function getColorFromHex(hexStr){
  var hex = parseInt(hexStr.charAt(0) == "#" ? hexStr.substring(1) : hexStr, 16)
  var r = hex >> 16;
  var g = hex >> 8 & 0xFF;
  var b = hex & 0xFF;
  return [r / 255 , g / 255, b / 255];
}