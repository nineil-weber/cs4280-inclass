// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Nils Murrugarra-Llerena"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

// [Fall 2022] - D3
import * as d3 from "d3";

// <svg width="500" height="600" style="background: rgb(232, 207, 207)" fill="transparent">d3.select('main')
let svg1 = d3.select('main').append('svg')
    .attr('width', 500)
    .attr('height', 600)
    .style('background', '#eee')
    .style('fill', 'transparent')

// <circle cx="150" cy="125" r="100" stroke="black" fill="transparent" >
let obj_circle = svg1.append('circle')
    .attr('cx', 150)
    .attr('cy', 125)
    .attr('r', 100)
    .attr('stroke', 'black')
    .attr('fill', 'transparent')

// svg - animate
function animate_circle()
{
    obj_circle
        .transition()
        .duration(2000)
        .attr('r', 25)
        .transition()
        .duration(2000)
        .attr('r', 100)
        .on('end', animate_circle)
}
animate_circle()

// <rect x="10" y="10" width="30" height="30" stroke="green" fill="green" >
let obj_rect = svg1
    .append('rect')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 30)
    .attr('height', 30)
    .attr('stroke', 'green')
    .attr('fill', 'green')

//svg - animateTransform
let interpol_rotate = d3.interpolateString('rotate(0, 150, 125)', 'rotate(360, 150, 125)')
function animate_rect()
{
    obj_rect
        .transition()
        // .attr('transform', 'translate(50, 50)')
        // .duration(1000)
        .attrTween('transform', function(d,i,a){return interpol_rotate})
        .duration(4000)
}
animate_rect()

let obj_rect2 = svg1
    .append('rect')
    .attr('x', 15)
    .attr('y', 15)
    .attr('width', 20)
    .attr('height', 20)
    .attr('stroke', 'red')
    .attr('fill', 'red')

let svg2 = d3.select('main')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .style('background', 'green')
    .style('fill', 'transparent')

svg2.append('circle')
    .attr('cx', 150)
    .attr('cy', 125)
    .attr('r', 100)
    .attr('stroke', 'black')
    .attr('fill', 'transparent')

svg2.append('rect')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 30)
    .attr('height', 30)
    .attr('stroke', 'green')
    .attr('fill', 'blue')

svg2
    .transition()
    .attr('transform', 'rotate(90)')
    .delay(1000)
    .duration(1000)
    .style("background-color", 'gray');

// // [Backup] - D3
// import * as d3 from "d3";
//
// let svg1 = d3.select('main')
//     .append('svg')
//     .attr('width',500)
//     .attr('height', 600)
//     .style('background', '#eee')
//     .style("fill", "transparent")
//     .attr("fill", 'white');
//
// svg1.append("circle")
//     .style("fill", "black")
//     .attr("cx", 50)
//     .attr("cy", 75)
//     .attr("r", 5);
//
// let obj_circle = svg1.append("circle")
//     .style("stroke", "black")
//     .style("fill", "transparent")
//     .attr("cx", 50)
//     .attr("cy", 75)
//     .attr("r", 100);
//
// // svg - animate
// function animate_circle()
// {
//     // https://www.guidodiepen.nl/2018/07/wrapping-my-head-around-d3-rotation-transitions/
//     obj_circle
//         .transition()
//         .duration(2000)
//         .attr('r', 25)
//         .transition()
//         .duration(2000)
//         .attr('r', 100)
//         .on("end", animate_circle);
// }
// animate_circle()
//
// let obj_rect = svg1.append("rect")
//     .attr("x",10)
//     .attr("y",10)
//     .attr("width", 30)
//     .attr("height", 30)
//     .attr("stroke", 'green')
//     .attr("fill", 'green');
//
//
// // svg - animate Transform
// var interpol_rotate = d3.interpolateString( "rotate(0,50,75)", "rotate(90,50,75)" )
// function animate_rect()
// {
//     obj_rect
//         .transition()
//         .attr('transform', 'translate(50, 50)')
//         .duration(1000)
//         .transition()
//         .attrTween('transform' , function(d,i,a){ return interpol_rotate } )
//         .duration(2000);
// }
// animate_rect()
//
// var svg2 = d3.select('main')
//     .append('svg')
//     .attr('width', 500)
//     .attr('height', 500)
//     .attr('background', '#a9a9a9') // change background color
//
// svg2.append("circle")
//     .style("stroke", "blue")
//     .style("stroke-width", 3)
//     .style("fill-opacity", 0.5)
//     .attr("r", 100)
//     .attr("cx", 150)
//     .attr("cy", 275);
//
// svg2.append("rect")
//     .attr("x",200)
//     .attr("y",300)
//     .attr("width", 130)
//     .attr("height", 150)
//     .style("fill", 'blue')
//     .style("stroke", 'white')
//     .style("stroke-width", 5)
//     .style("stroke-dasharray", [15, 5]);
//
// svg2.transition().attr('transform', 'rotate(90)').delay(1000).duration(1000).style("background-color", "gray");
//
// svg1.append('ellipse')
//     .attr('cx', 250)
//     .attr('cy', 450)
//     .attr('rx', 200)
//     .attr('ry', 100)
//     .style('fill', 'none')
//     .style('stroke', 'green')
//
// svg1.append('line')
//     .attr('x1', 0)
//     .attr('y1', 0)
//     .attr('x2', 500)
//     .attr('y2', 600)
//     .style('stroke', 'maroon');
//
// svg1.append("path")
//     .style("stroke", "red")
//     .style('fill', 'none')
//     .style('stroke-width', 3)
//     .attr("d", "M100,200 L200,400 v-50 h30 Z")
//
// // Quadratic curve
// svg1.append('circle')
//     .attr('cx', 150) // 150 | 150
//     .attr('cy', 300) // 500 | 300
//     .attr('r', 3)
//     .style('fill', 'blue');
//
// svg1.append("path")
//     .style("stroke", "blue")
//     .style('fill', 'none')
//     .style('stroke-width', 3)
//     .attr("d", "M100,400 Q150,300 400,400") // 500 --> 300
//
// // Cubic curve
// svg1.append('circle')
//     .attr('cx', 150) // 150 | 150
//     .attr('cy', 350) // 550 | 350
//     .attr('r', 3)
//     .style('fill', 'green');
//
// svg1.append('circle')
//     .attr('cx', 400)
//     .attr('cy', 550)
//     .attr('r', 3)
//     .style('fill', 'green');
//
// // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
// svg1.append("path")
//     .style("stroke", "green")
//     .style('fill', 'none')
//     .style('stroke-width', 3)
//     .attr("d", "M100,400 C150,350 400,550 450, 450") // C150,550 --> C150,350
//
// // Animations link: https://www.guidodiepen.nl/2018/07/wrapping-my-head-around-d3-rotation-transitions/
