// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Abdulmalek Al-Gahmi"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

//Then: comes everything else
// TODO
let x = 10
const PI = 3.14

console.log(x)
console.log(PI)

let ch = "A"
let choice = 'Ok'

let desc = `this
is
a multiline string`

console.log(desc)

let fn = 'John';
let ln = 'Doe';

let name = `My name is ${fn} ${ln}.`


let numbers = [2,4,5, 12, 34, 67,9,18]
console.log(numbers.length)

console.log(numbers.map(
  (x) => x * 3
))

numbers.push(22)
numbers.unshift(11)

for(let i = 0; i < numbers.length; i++){
  console.log(numbers[i] * 3)
}


for(let n of numbers){
  console.log(n * 3)
}

for(let i in numbers){
  console.log(numbers[i] * 3)
}

let self = {
  fn: 'Abdulmalek',
  ln: 'Al-Gahmi',
  school: 'WSU'
}


for(let p in self){
  console.log(`${p}: ${self[p]}`)
}
console.log(self.fn)
console.log(numbers)


function getMax(x, y){
  return Math.max(x,y)
}

console.log(getMax(14,11))

const gMax = function(x, y){
  return Math.max(x, y)
}

const gm = (x, y) => Math.max(x, y)

const gm1 = (x, y) => {
  return Math.max(x, y)
}
console.log(name)

////////////////////////
import * as d3 from "d3";
let da = [
  [18, 'One'],
  [19, 'Two'],
  [16, 'Three'],
  [14, 'Four'],
  [17, 'Five'],
  [19, 'Six'],
]

d3.select('article')
  .append('svg')
  .attr('width',500)
  .attr('height', 600)
  .style('background', '#eee')

d3.select('svg').selectAll('rect')
   .data(da)
   .enter()
   .append('rect')
   .attr('x', 0)
   .attr('y', function(d, i){
     return i * 30
   })
   .attr('height', 15)
   .attr('width', (d)=>{
     return d[0] * 3
   })

 d3.select('svg').selectAll('text') 
   .data(da)
   .enter()
   .append('text')
   .attr('x', function(d){
     return d[0] * 3 + 10
   })
   .attr('y', function(d, i){
     return i * 30 + 16
   })
   .text(function(d){
     return d[1]
   })
