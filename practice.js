function sayHi() { return "hi" }

const a = sayHi
const b = sayHi()

console.log(a)
console.log(b)
console.log(a())

const c = () => sayHi()

console.log(c)
console.log(c())

//[Function: c]
//hi