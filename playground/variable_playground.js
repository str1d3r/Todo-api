// var person = {
// 	name: 'Jordan',
// 	age: 21
// };
//
// function updatePerson(obj) {
// 	// obj = {
// 	// 	name: 'Jordan',
// 	// 	age: 33
// 	// }
// 	obj.age = 33;
// };
//
// updatePerson(person);
// console.log(person);

// Array example

var array = [15, 27];


function updateGrade1(obj) {

	obj.push(33);
	debugger;
};


function updateGrade2(obj) {

	obj = [12, 13, 14];
};

updateGrade1(array);
console.log(array);
updateGrade2(array);
console.log(array);
