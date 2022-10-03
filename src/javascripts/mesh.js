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
    this.theta = 0
    this.phi = 0
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
    console.log('Update points by: ['+tx+', '+ty+', '+tz+']')
    this.control_points[p][q].x =  this.control_points[p][q].x + tx;
    this.control_points[p][q].y =  this.control_points[p][q].y + ty;
    this.control_points[p][q].z =  this.control_points[p][q].z + tz;
  }

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
    // plot(g, 0.1)
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

    // CEsfera e = new CEsfera(5,new Color(0,0,0),i,j,k);
    // e.theta = theta;
    // e.phi = phi;

    let point_3d_instance, point_start, point_end

    // Init points
    this.v_out = []
    this.c_out = []

    // Horizontal pass
    console.log("t --> s");
    for(let t=0.0;t<=1.0;t+=inc)
    {
      for(let s=0.0;s<=1.0;s+=inc)
      {
        point_3d_instance = this.compute_point(s, t, this.control_points) // beta function
        // punto3d.angTheta = theta;
        // punto3d.angPhi = phi;
        // punto2Df=punto3d.Proyectar(proy); // convierte a 2D
        // puntitof=cambiarCoordenadasDispositivo(punto2Df,800,600);

        point_start = point_3d_instance
        // console.log( "[t="+t+",s="+s+"]" )
        // point_3d_instance.print()

        if(s!=0)
        {
          // g.drawLine(puntitoi[0],puntitoi[1],puntitof[0],puntitof[1]);

          // Draw line
          this.v_out.push(point_start.x, point_start.y, point_start.z)
          this.c_out.push(blue_color[0], blue_color[1], blue_color[2])
          this.v_out.push(point_end.x, point_end.y, point_end.z)
          this.c_out.push(blue_color[0], blue_color[1], blue_color[2])
        }
        point_end = point_start
      }
    }

    // Vertical pass
    console.log("s --> t");
    for(let s=0.0; s<=1.0; s+=inc)
    {
      for(let t=0.0; t<=1.0; t+=inc)
      {
        point_3d_instance = this.compute_point(s, t, this.control_points) // beta function
        // ////////////////////////////////////////////
        // punto3d.angTheta = theta;
        // punto3d.angPhi = phi;
        // punto2Df=punto3d.Proyectar(proy);
        // ////////////////////////////////////////////
        // puntitof=cambiarCoordenadasDispositivo(punto2Df,800,600);
        point_start = point_3d_instance
        // console.log("[s="+s+",t="+t+"]")
        // point_3d_instance.print()

        if(t != 0.0)
        {
          // g.drawLine(puntitoi[0],puntitoi[1],puntitof[0],puntitof[1]);
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
