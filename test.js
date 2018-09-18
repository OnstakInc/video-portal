var fs = require('fs');

var token = fs.readFileSync('./token.txt', 'utf-8');

var x = fs.writeFileSync('./token.txt', 'This is a test file...');

console.log(token);