export class Sphere {
  constructor(r = .9, nPoints = 36) {
    this.vertices = []
    for (let i = 0; i < nPoints; i++) {
      let theta = i * Math.PI / nPoints;

      for (let j = 0; j < nPoints / 2; j++) {
        let phi = j * 2 * Math.PI / nPoints;
        this.vertices.push(
          r * Math.cos(phi) * Math.sin(theta),
          r * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta));
      }
    }
  }
}