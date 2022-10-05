// Functions
function multiply_matrices(A, B)
{
  let C

  let nrows_A = A.length
  let ncols_A = A[0].length
  let nrows_B = B.length
  let ncols_B = B[0].length

  // Init C
  C = []
  for(let i=0; i< nrows_A; i++)
  {
    C.push([])
    for (let j=0; j<ncols_B; j++)
    {
      C[i].push(0)
    }
  }

  if (ncols_A == nrows_B)
  {
    for (let i=0;i<nrows_A;i++)
    {
      for (let j=0;j<ncols_B;j++)
      {
        for(let k=0; k<ncols_A; k++)
        {
          C[i][j] = C[i][j]+ A[i][k]*B[k][j]
        }
      }
    }
  }
  return C
}

// Class
export class point_3d{
  constructor(x, y, z)
  {
    this.x = x
    this.y = y
    this.z = z
  }

  print()
  {
    console.log('['+this.x+','+this.y+','+this.z+']')
  }
}

export class Mesh {
  constructor(in_control_points){
    // Init
    this.v_out = []
    this.c_out = []

    this.control_points = []
    this.color = 0
    this.current_point = 0

    // Process
    this.theta=Math.PI*(45/180.0)
    this.phi=Math.PI*(45/180.0)
    this.control_points = in_control_points
  }

  // Functions
  update_to_next_current_point()
  {
    if(this.current_point + 1 <= 15)
      this.current_point += 1
  }

  update_to_prev_current_point()
  {
    if(this.current_point - 1 >= 0)
      this.current_point -= 1
  }

  // Operations
  traslade_current_point(tx, ty, tz)
  {
    let p, q, k=0;

    for (let i=0;i<4;i++)
    {
      for (let j=0;j<4;j++)
      {
        if(k == this.current_point)
        {
          p = i;
          q = j;
        }
        k++;
      }
    }
    // console.log('Update points by: ['+tx+', '+ty+', '+tz+']')
    this.control_points[p][q].x =  this.control_points[p][q].x + tx;
    this.control_points[p][q].y =  this.control_points[p][q].y + ty;
    this.control_points[p][q].z =  this.control_points[p][q].z + tz;
  }

  rotate_fun(rot_mat)
  {
    let i, j, k
    let points_mat // 4 by 16

    points_mat = []
    points_mat[0] = []
    points_mat[1] = []
    points_mat[2] = []
    points_mat[3] = []

    for (i=0;i<4;i++)
    {
      for (j=0;j<4;j++)
      {
        points_mat[0].push( this.control_points[i][j].x );
        points_mat[1].push( this.control_points[i][j].y );
        points_mat[2].push( this.control_points[i][j].z );
        points_mat[3].push( 1 );
      }
    }

    let result_mat = multiply_matrices(rot_mat, points_mat)

    // Copy back to control points
    k = 0
    for (i=0;i<4;i++)
    {
      for (j=0;j<4;j++)
      {
        this.control_points[i][j].x = result_mat[0][k]
        this.control_points[i][j].y = result_mat[1][k]
        this.control_points[i][j].z = result_mat[2][k]
        // Discard homogeneus coordinates
        k += 1
      }
    }
  }

  rotate_x(angle)
  {
    let phi = angle*(Math.PI/180.0) // degress --> radians
    let rot_x = [ [1,0            ,0             ,0],
                  [0,Math.cos(phi),-Math.sin(phi),0],
                  [0,Math.sin(phi), Math.cos(phi),0],
                  [0,0            ,0            ,1]]

    this.rotate_fun(rot_x)
  }

  rotate_y(angle)
  {
    let phi = angle*(Math.PI/180.0) // degress --> radians
    let rot_y = [ [Math.cos(phi), 0,Math.sin(phi),0],
                  [0,             1,0,            0],
                  [-Math.sin(phi),0,Math.cos(phi),0],
                  [0,             0,0            ,1]]

    this.rotate_fun(rot_y)
  }

  rotate_z(angle)
  {
    let phi = angle*(Math.PI/180.0) // degress --> radians
    let rot_z = [ [Math.cos(phi),-Math.sin(phi),0,0],
                  [Math.sin(phi),Math.cos(phi),0,0],
                  [0,            0,            1,0],
                  [0,            0,            0,1]]

    this.rotate_fun(rot_z)
  }

  // Helpers
  compute_bezier_function(t, index)
  {
    let f = 0.0
    switch(index)
    {
      case 0:
        f= Math.pow((1-t),3)
        break
      case 1:
        f= 3*t*(Math.pow((1-t),2))
        break
      case 2:
        f= 3*Math.pow(t,2)*(1-t)
        break
      case 3:
        f= Math.pow(t,3)
        break
    }
    return f
  }

  compute_point(s, t, control_points)
  {
    // Compute Beta Function
    let x=0.0, y=0.0, z=0.0, px=0.0, py=0.0, pz=0.0

    for (let i=0; i<4; i++)
    {
      x=0.0
      y=0.0
      z=0.0
      for(let j=0; j<4; j++)
      {
        x = x + control_points[i][j].x * this.compute_bezier_function(t, j)
        y = y + control_points[i][j].y * this.compute_bezier_function(t, j)
        z = z + control_points[i][j].z * this.compute_bezier_function(t, j)
      }
      px = px + x * this.compute_bezier_function(s,i)
      py = py + y * this.compute_bezier_function(s,i)
      pz = pz + z * this.compute_bezier_function(s,i)
    }
    return new point_3d(px, py, pz)
  }

  plot(inc)
  {
    let i =0, j=0, k = 0, p=0, q=0
    let blue_color = [1, 0, 0]

    // Find current point
    for (let i=0; i<4; i++)
    {
      for (let j=0; j<4; j++)
      {
        if( k==this.current_point )
        {
          p = i
          q = j
        }
        k++
      }
    }
    i = this.control_points[p][q].x
    j = this.control_points[p][q].y
    k = this.control_points[p][q].z

    let point_3d_instance, point_start, point_end

    // Init points
    this.v_out = []
    this.c_out = []

    // Horizontal pass
    // console.log("t --> s");
    for(let t=0.0;t<=1.0;t+=inc)
    {
      for(let s=0.0;s<=1.0;s+=inc)
      {
        point_3d_instance = this.compute_point(s, t, this.control_points) // beta function
        point_start = point_3d_instance
        // point_3d_instance.print()

        if(s!=0)
        {// Draw line
          this.v_out.push(point_start.x, point_start.y, point_start.z)
          this.c_out.push(blue_color[0], blue_color[1], blue_color[2])
          this.v_out.push(point_end.x, point_end.y, point_end.z)
          this.c_out.push(blue_color[0], blue_color[1], blue_color[2])
        }
        point_end = point_start
      }
    }

    // Vertical pass
    // console.log("s --> t");
    for(let s=0.0; s<=1.0; s+=inc)
    {
      for(let t=0.0; t<=1.0; t+=inc)
      {
        point_3d_instance = this.compute_point(s, t, this.control_points) // beta function
        point_start = point_3d_instance
        // point_3d_instance.print()

        if(t != 0.0)
        {
          // Draw line
          this.v_out.push(point_start.x, point_start.y, point_start.z)
          this.c_out.push(blue_color[0], blue_color[1], blue_color[2])
          this.v_out.push(point_end.x, point_end.y, point_end.z)
          this.c_out.push(blue_color[0], blue_color[1], blue_color[2])
        }
        point_end = point_start
      }
    }
    // e.dibujarEsfera(g);
  }

  print()
  {
    let cur_point
    for(let i=0; i<4; i++)
    {
      console.log('row ' + i)
      for(let j=0;j<4;j++)
      {
        cur_point = this.control_points[i][j]
        cur_point.print()
      }
    }
  }

}
