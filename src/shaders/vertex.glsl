#version 300 es

in vec3 coordinates;
void main(void) {
  gl_Position = vec4(coordinates, 1.0);
  gl_PointSize = 8.0;
}