const alphabet = "abcdefghijklmnopqrstuvwxyz";
const VALID_VARIABLE_CHARS = `${alphabet}${alphabet.toUpperCase()}$._[]1234567890`;

let isValidBasedOnIndex = (char) => {
	return VALID_VARIABLE_CHARS.indexOf(char) > -1;
};

let isValidBasedOnRegex = (char) => {
	return char.match(/[a-zA-z0-9\.\[\]\$\._]/)
};

var start = new Date().getTime();
for (let i = 0; i <= 10000000; i++) {
	isValidBasedOnRegex(".");
}
let end = new Date().getTime();
console.log("isValidBasedOnRegex:", end - start);


let start2 = new Date().getTime();
for (let i = 0; i <= 10000000; i++) {
	isValidBasedOnIndex(".");
}
let end2 = new Date().getTime();
console.log("isValidBasedOnIndex:", end2 - start2);