export class Cube {
  constructor(){
    this.vertices = [
      -.5, -.5,  .5, // 0
       .5, -.5,  .5, // 1
       .5,  .5,  .5, // 2
      -.5,  .5,  .5, // 3
      -.5, -.5, -.5, // 4
       .5, -.5, -.5, // 5
       .5,  .5, -.5, // 6
      -.5,  .5, -.5  // 7
    ]
  
    this.indices = []

    this.face(0, 1, 2, 3) // front
    this.face(5, 4, 7, 6) // back
    this.face(3, 2, 6, 7) // top
    this.face(1, 0, 4, 5) // bottom
    this.face(4, 0, 3, 7) // left
    this.face(1, 5, 6, 2) // right

    this.v_out = []
    for(let i of this.indices){
      this.v_out.push(this.vertices[3 *i],
                      this.vertices[3 *i + 1],
                      this.vertices[3 *i + 2])
    }

    this.colors = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1]
    ]

    this.c_out = []
    for(let c of this.colors){
      for(let i = 0; i < 6; i++){
        this.c_out.push(c[0], c[1], c[2])
      }
    }
  }

  face(a, b, c , d){
    this.indices.push(a, b, c)
    this.indices.push(a, c, d)
  }

  fixColors(nc) // for Activity 05 solution
  {
    this.colors=nc

    this.c_out = []
    for(let c of this.colors){
      for(let i = 0; i < 6; i++){
        this.c_out.push(c[0], c[1], c[2])
      }
    }
  }
}
