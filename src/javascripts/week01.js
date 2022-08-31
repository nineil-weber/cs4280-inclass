// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Nils Murrugarra-Llerena"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

// [Fall 2022]  - JavaScript
let x = 3
console.log(x)

str1 = `this
is a
multi-line string`

console.log(str1)

let fn ='Nils'
let ln = 'Murrugarra'

console.log(`My name is ${fn} ${ln}`)

// Arrays
let numbers = [1, 2, 3, 4]
console.log( numbers.length )
console.log('[Init array]')
console.log( numbers )

console.log('[Updated array]')
console.log( numbers.map((x) => x*2) )

numbers.push(5)
numbers.unshift(0)
console.log(numbers)

for(let i=0; i<numbers.length; i++)
{
    console.log('Number: '+numbers[i])
}

let student =
    {
        w_number: 123,
        name: 'student_1',
        age: 20,
        phone_number: 1234,
    }

console.log('Print Struct')
for(let f in student){
    console.log(`${f}: ${student[f]}`)
}

//Functions
function getMax(x, y)
{
    return Math.max(x, y)
}
output = getMax(3, 7)
console.log(output)

const gm = (x,y) => Math.max(x, y) // Similar to Lambda Function (python)
output_2 = gm(3, 9)
console.log(output_2)

// // [Previous class] - JavaScript
// let x = 10
// const PI = 3.14
//
// console.log(x)
// console.log(PI)
//
// let ch = "A"
// let choice = 'Ok'
//
// let desc = `this
// is
// a multiline string`
//
// console.log(desc)
//
// let fn = 'John';
// let ln = 'Doe';
//
// let name = `My name is ${fn} ${ln}.`
//
//
// // Arrays
// let numbers = [2,4,5, 12, 34, 67,9,18]
// console.log(numbers.length)
//
// console.log('[Init]')
// console.log(numbers.map(
//   (x) => x * 3
// ))
//
// numbers.push(22) // Add new element at end
// numbers.unshift(11) // Add new element at beginning
//
// console.log('[Update]')
// for(let i = 0; i < numbers.length; i++){
//   console.log(numbers[i] * 3)
// }
//
// console.log('[Print 1]')
// for(let n of numbers){
//   console.log(n * 3)
// }
//
// console.log('[Print 2]')
// for(let i in numbers){
//   console.log(numbers[i] * 3)
// }
//
// let self = {
//   fn: 'Nils',
//   ln: 'Murrugarra-Llerena',
//   school: 'WSU'
// }
//
// console.log('Print struct')
// for(let p in self){
//   console.log(`${p}: ${self[p]}`)
// }
//
// console.log(self.fn)
// console.log(numbers)
//
// // Functions
// function getMax(x, y){
//   return Math.max(x,y)
// }
//
// console.log(getMax(14,11))
//
// const gMax = function(x, y){
//   return Math.max(x, y)
// }
//
// const gm = (x, y) => Math.max(x, y)
//
// const gm1 = (x, y) => {
//   return Math.max(x, y)
// }
//
// console.log(gMax(14,11))
// console.log(gm(14,11))
// console.log(gm1(14,11))
//
// console.log(name)

// //////////////////////// [Previous class] - D3
// import * as d3 from "d3";
// let da = [
//   [18, 'One'],
//   [19, 'Two'],
//   [16, 'Three'],
//   [14, 'Four'],
//   [17, 'Five'],
//   [19, 'Six'],
// ]
//
// d3.select('main')
//   .append('svg')
//   .attr('width',500)
//   .attr('height', 600)
//   .style('background', '#eee') // change background color
//
// //Draw rectangles
// d3.select('svg').selectAll('rect')
//    .data(da)
//    .enter()
//    .append('rect') // draw rectangle
//    .attr('x', 0) // x coordinates
//    .attr('y', function(d, i){
//      return i * 30
//    }) // y coordinates
//    .attr('height', 15)
//    .attr('width', (d)=>{
//      return d[0] * 3
//    })
//
// // Add Text
//  d3.select('svg').selectAll('text')
//    .data(da)
//    .enter()
//    .append('text')
//    .attr('x', function(d){
//      return d[0] * 3 + 10
//    }) // x coordinates
//    .attr('y', function(d, i){
//      return i * 30 + 16
//    }) // y coordinates
//    .text(function(d){
//      return d[1]
//    }) // add text
