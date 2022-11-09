import * as THREE from 'three'

export function somePattern(width, height){
  let c = new THREE.Color(1,0,1)
  let texels = new Uint8Array(3 * width * height) // size of 3 because of RGB format
  for(let i = 0; i < width * height; i++){
    let stride = i * 3
    texels[stride] = Math.floor(c.r * 255)
    texels[stride + 1] = Math.floor(c.g * 255)
    texels[stride + 2] = 255
  }

  return new THREE.DataTexture(texels, width, height, THREE.RGBFormat)
}

export function sinusoidal(size) // https://es.wikipedia.org/wiki/Sinusoide
{
  let texels = new Uint8Array(4 * size * size) // [size, size] is the dimension of the image, and 4 because of RGBA format
  for(let i = 0; i < size; i++)
  {
    for(let j = 0; j < size; j++)
    {
      let c = 127 + 127 * Math.sin(0.1 * i * j) // sin function. 127 because uint8 range is [0, 256]. Sin varies between -1 and 1.
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
      // let c = (cx % 2 !== cy % 2) ? 187 : 90
      let c = (cx % 2 !== cy % 2) ? 255 : 0
      texels[4 * i * width + 4 * j] = c;
      texels[4 * i * width + 4 * j + 1] = c;
      texels[4 * i * height + 4 * j + 2] = c;
      texels[4 * i * height + 4 * j + 3] = c;
    }
  }

  return new THREE.DataTexture(texels, width, height, THREE.RGBAFormat)
}