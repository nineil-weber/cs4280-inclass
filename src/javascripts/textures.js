import * as THREE from 'three'

export function somePattern(width, height){
  let c = new THREE.Color(1,0,1)
  let texels = new Uint8Array(3 * width * height)
  for(let i = 0; i < width * height; i++){
    let stride = i * 3
    texels[stride] = Math.floor(c.r * 255)
    texels[stride + 1] = Math.floor(c.g * 255)
    texels[stride + 2] = 255
  }

  return new THREE.DataTexture(texels, width, height, THREE.RGBAFormat)
}

export function sinusoidal(size){
  let texels = new Uint8Array(4 * size * size)
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      let c = 127 + 127 * Math.sin(0.1 * i * j)
      texels[4 * i * size + 4 * j] = c;
      texels[4 * i * size + 4 * j + 1] = c;
      texels[4 * i * size + 4 * j + 2] = c;
      texels[4 * i * size + 4 * j + 3] = c;
    }
  }

  return new THREE.DataTexture(texels, size, size, THREE.RGBAFormat)
}

export function checkerboard(width, height, R_DIVS=8, C_DIVS=8){
  let texels = new Uint8Array(4 * width * height)
  let dx = width / R_DIVS, dy = height / C_DIVS
  for(let i = 0; i < width; i++){
    let cx = Math.floor(i / dx)
    for(let j = 0; j < height; j++){
      let cy = Math.floor(j / dy)
      let c = (cx % 2 !== cy % 2) ? 187 : 90
      texels[4 * i * width + 4 * j] = c;
      texels[4 * i * width + 4 * j + 1] = c;
      texels[4 * i * height + 4 * j + 2] = c;
      texels[4 * i * height + 4 * j + 3] = c;
    }
  }

  return new THREE.DataTexture(texels, width, height, THREE.RGBAFormat)
}