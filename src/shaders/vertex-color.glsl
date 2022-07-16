#version 300 es

in vec3 coordinates;
in vec3 color;
out vec4 vColor;
void main(void) {
  gl_Position = vec4(coordinates, 1.0);
  gl_PointSize = 8.0;
  vColor = vec4(color, 1.0);
}