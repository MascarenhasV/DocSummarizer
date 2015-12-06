var fs = require("fs");
var natural = require("natural");

//declaration
var wordIndex = {};
var trigramIndex = {};
var words = "";

//read by line and find the line count, word count and word frequencies
var rl = require('readline').createInterface({
	input: fs.createReadStream('a.txt')
});

rl.on('line', function (line) {
	currentLine = line.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g," ").toLowerCase().split(" ");
	words +=currentLine
	currentLine.forEach(function (word){
		if(word === " " || word === "")
		return;
		if(!(wordIndex.hasOwnProperty())){
			if(wordIndex[word] == undefined)
			wordIndex[word] = 0;
		}
		wordIndex[word]++;
	}
	);
	
});
rl.on('close', function (line) {
	
	var NGrams = natural.NGrams
	var trigram = NGrams.trigrams(words);
	console.log(trigram);
	var tSize = trigram.length;
	var index = 0;
	while(index < tSize){
		if(!(trigramIndex.hasOwnProperty())){
			if(trigramIndex[trigram[index]] == undefined)
			trigramIndex[trigram[index]] = 0;
		}
		trigramIndex[trigram[index]]++;
		index++;
	}
	
	
	console.log(trigramIndex);
	console.log(wordIndex);
	console.log('done reading file.');
});
