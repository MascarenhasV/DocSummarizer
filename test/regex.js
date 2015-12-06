var fs = require("fs");

var fileName = process.argv[2];
console.log("Reading the contents of the file..." + fileName);

//read by line and find the line count, word count and word frequencies
var rl = require('readline').createInterface({
	input: fs.createReadStream(fileName)
});
rl.on('line', function (line) {	
	currentLine = line.replace(/'/g, '').replace(/[^\w\s]/gi, ' ').toLowerCase().split(" ");
	//currentLine = line.replace(/[.,?!;()"-]/g, " ").replace(/'/g, "").replace(/\s+/g," ").toLowerCase().split(" ");
	console.log(line);
	console.log(currentLine);
});