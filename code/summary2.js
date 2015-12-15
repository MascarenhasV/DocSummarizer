//document summary
var fs = require("fs");

console.log("Program started.........");

//global variables
var lineCount = 0;
var wordCount = 0;
var wordIndex = {};
var ngramIndex = {};
var sortedngrams = [];
var words = [];
var nGram = 3;

//HTML variables
var body = "";
var htmlContent = "";
var NEW_LINE = "<br>";
var STYLE = "<head><style> table, th, td {border: 1px solid black;} table {border-collapse: collapse; margin-left: auto; margin-right: auto;} tr:nth-child(even) {background-color: #f2e2f1} .centered { text-align: center; }</style></head>"
var START_DIV = "<div class='centered'>";
var END_DIV = "</div>"
var START_TABLE = "<table>";
var HEADER_START = "<th>"
var HEADER_END = "</th>"
var END_TABLE = "</table>";
var START_ROW = "<tr>";
var START_COL = "<td>";
var END_ROW = "</tr>";
var END_COL = "</td>";
var START_H3 = "<h3>";
var END_H3 = "</h3>"

//accept file name as parameter 
// example - node summary.js abc.txt
var fileName = process.argv[2];
console.log("Reading the contents of the file........." + fileName);

//read by line and find the line count, word count and word frequencies
var rl = require('readline').createInterface({
	input: fs.createReadStream(fileName)
});
rl.on('line', function (line) {
	
	lineCount++;
	//use regex to replace special characters with a blank space and split it in words
	//currentLine = line.replace(/'/g, '').replace(/[^\w\s]/gi, ' ').toLowerCase().split(" ");
	currentLine = line.replace(/[^\w\s]/gi, ' ').toLowerCase().split(" ");
	currentLine.forEach(function (word){
		//skip blanks
		if(word === " " || word === "")
			return;
		wordCount++;
		words.push(word);
		if(!(wordIndex.hasOwnProperty())){
			if(wordIndex[word] == undefined)
				wordIndex[word] = 0;
		}
		//increment the counter of the word frequency
		wordIndex[word]++;
	}
	);
	
});
rl.on('close', function (line) {
	
	console.log('Done reading file.........');
	
	console.log('Creating nGrams.........');
	//fetch array of nGrams
	var ngram = createNGram(words, nGram);
	var tSize = ngram.length;
	var index = 0;
	while(index < tSize){
		if(!(ngramIndex.hasOwnProperty())){
			if(ngramIndex[ngram[index]] == undefined)
				ngramIndex[ngram[index]] = 0;
		}
		ngramIndex[ngram[index]]++;
		index++;
	}
	console.log('Building HTML content.........');
	//build the HTML content
	buildHTMLContent();
	
	//write HTML content to file
	writeToFile(htmlContent);
	console.log('Done!');
	
});

/*
	Start builiding the HTML content for the output
*/

function buildHTMLContent(){
	body += START_H3+"The summary of the document is as follows: "+END_H3+NEW_LINE;
	body += "Name of the document: "+fileName+NEW_LINE;
	body += "Number of words in the document: "+wordCount+NEW_LINE;
	body += "Number of lines in the document: "+lineCount+NEW_LINE;
	
	buildWordCountTable();
	buildngramTable();
	buildEditDistanceTableForngrams();
	htmlContent = "<html>"+STYLE+"<body>" + body+ "</body></html>";
	
}

/*
	Builds a tabular representation of the the words and their frequencies
*/
function buildWordCountTable(){
	
	var content = NEW_LINE+START_H3+"The words and their frequency are:"+END_H3+NEW_LINE;
	content += START_DIV + START_TABLE;
	content += HEADER_START + "Words"+ HEADER_END + HEADER_START +"Frequency" +HEADER_END
	var sortedWords = sortDesc(wordIndex);
	var wordsLen = sortedWords.length;
	for(var i = 0; i < wordsLen; i++){
		var word = 	sortedWords[i].key;
		var frequency = sortedWords[i].value;
		content += START_ROW +START_COL + word + END_COL + START_COL + frequency + END_COL + END_ROW;		
	}
	content += END_DIV + END_TABLE;
	body += content;
}

/*
	Initialize the HTML content of the data
*/
function buildngramTable(){
	var content = NEW_LINE+START_H3+"The 10 most common ngrams are: "+END_H3+NEW_LINE;
	content += START_TABLE;
	content += HEADER_START + "Common ngrams"+ HEADER_END + HEADER_START +"Frequency" +HEADER_END;
	sortedngrams = sortDesc(ngramIndex);
	//clear the ngramIndex object and use sortedngrams array for further operations
	ngramIndex = null;
	
	//show the top 10 ngrams
	var count = 10;
	for(var i = 0; i < sortedngrams.length && count-- > 0; i++){
		var ngrams = 	sortedngrams[i].key;
		var frequency = sortedngrams[i].value;
		content += START_ROW +START_COL + ngrams + END_COL + START_COL + frequency + END_COL + END_ROW;		
	}
	content += END_TABLE;
	body += content;
}

/*
	Builds a tabular representation of the the ngrams and their frequencies
*/
function buildEditDistanceTableForngrams(){
	var mostCommonngram = sortedngrams[0].key;
	var content = NEW_LINE+START_H3+"The most common ngrams is: "+mostCommonngram+END_H3;
	content += START_TABLE;
	content += HEADER_START + "Common ngrams"+ HEADER_END + HEADER_START +"Edit distance from the most common ngram" +HEADER_END
	
	var count = 10;
	for(var i = 1; i < sortedngrams.length && count-- > 0; i++){
		var ngrams = 	sortedngrams[i].key;
		//console.log(ngrams.replace(/[,]/g, " "), mostCommonngram.replace(/[,]/g, " "));
		var editDistance = findEditDistance(ngrams.replace(/[,]/g, " "), mostCommonngram.replace(/[,]/g, " "));
		content += START_ROW +START_COL + ngrams + END_COL + START_COL + editDistance + END_COL + END_ROW;		
	}
	content += END_TABLE;
	body += content;
}

/*
	The utility function that finds the edit distance between two words
*/
function findEditDistance(word1,word2) {
	var length1 = word1.length;
	var length2 = word2.length;	
	//console.log(length1);
	//console.log(length2);
	var arr = [];
	arr[0] = 0;
	for (var j = 1; j <= length2; j++)
		arr[j] = j;	
		for (var i = 1; i <= length1; i++)
		{
			var prev = i;
			for (var j = 1; j <= length2; j++)
			{
				var cur;
				if (word1.charAt(i-1) == word2.charAt(j-1)) {
					cur = arr[j-1];
					} 
				else {
					cur = Math.min(Math.min(arr[j-1], prev), arr[j]) + 1;
				}
				arr[j-1] = prev;
				prev = cur;
			}
			arr[length2] = prev;
		}
	return arr[length2];
}


/*
	The utility function that sorts the array in descending order of its value
*/
function sortDesc(obj) {
    var arr = [];
    for (var val in obj) {
        if (obj.hasOwnProperty(val)) {
            arr.push({'key': val, 'value': obj[val]});
		}
	}
    arr.sort(function(v1, v2) { return v2.value - v1.value; });
    return arr;
}

/*
	The utility function that writes the data to the file
*/
function writeToFile(data){	
	//use negative lengths for slicing .txt from the file name
	var htmlFile = fileName.slice(-fileName.length,-4)+".html";
	console.log("Writing contents to the file........."+htmlFile);
	fs.writeFile(htmlFile, data, function(err){
		if(err){
			return console.error(err);
		}
	});
}

/*
	Creates an array of ngrams from a list of words
*/
function createNGram(words, nGram){
	
	var ngrams = [];
	var ngramList = [];
	var count = nGram;
	//console.log(words);
	var wordsLen = words.length;
	for(var i = 0; i < wordsLen; i++){
		var word = words[i];
		ngrams.push(word);
		count--;
		if(count == 0){
			ngramList.push(ngrams);
			ngrams = [];
			count = nGram;
			i = i - (nGram -1);
		}
	}
	//console.log(ngramList);
	return ngramList;
}