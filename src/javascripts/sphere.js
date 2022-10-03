export class Sphere {
  constructor(r = .9, nPoints = 36) {
    this.vertices = []
    let inc_theta =  2 * Math.PI / nPoints
    let inc_phi = Math.PI / nPoints
    for (let i = 0; i < nPoints; i++) {
      let theta = i * inc_theta;

      for (let j = 0; j < nPoints; j++)
      {
        let phi = j * inc_phi;

        //From Class
        let x = r  * Math.sin(phi) * Math.cos(theta)
        let y = r * Math.sin(phi) * Math.sin(theta)
        let z = r * Math.cos(phi)

        // //Convert to WebGL Axes
        // let z = r  * Math.sin(phi) * Math.cos(theta) // x --> z
        // let x = r * Math.sin(phi) * Math.sin(theta) // y -->x
        // let y = r * Math.cos(phi) // z -->y

        this.vertices.push(x, y, z);
      }
    }
  }
}