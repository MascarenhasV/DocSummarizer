//document summary
var fs = require("fs");
var natural = require("natural");

console.log("Program started");

//global variables
var lineCount = 0;
var wordCount = 0;
var wordIndex = {};
var trigramIndex = {};
var sortedTrigrams = [];
var words = "";

//HTML variables
var body = "";
var htmlContent = "";
var NEW_LINE = "<br>";
var STYLE = "<head><style> table, th, td {border: 1px solid black;}</style></head>"
var START_TABLE = "<table>";
var HEADER_START = "<th>"
var HEADER_END = "</th>"
var END_TABLE = "</table>";
var START_ROW = "<tr>";
var START_COL = "<td style = 'border: 1px solid black'>";
var END_ROW = "</tr>";
var END_COL = "</td>";

//accept file name as parameter 
// example - node summary.js abc.txt
var fileName = process.argv[2];
console.log("Reading the contents of the file..." + fileName);

//read by line and find the line count, word count and word frequencies
var rl = require('readline').createInterface({
	input: fs.createReadStream(fileName)
});
rl.on('line', function (line) {
	
	lineCount++;
	currentLine = line.replace(/[.,?!;()"-]/g, " ").replace(/'/g, "").replace(/\s+/g," ").toLowerCase().split(" ");
	words +=currentLine
	currentLine.forEach(function (word){
		if(word === " " || word === "")
		return;
		wordCount++;
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
	
	buildHTMLContent();
	
	console.log('done reading file.');
});

/*
	Start builiding the HTML content for the output
*/

function buildHTMLContent(){
	body += "The summary of the document is as follows: "+NEW_LINE;
	body += "Name of the document: "+fileName+NEW_LINE;
	body += "Number of words in the document: "+wordCount+NEW_LINE;
	body += "Number of lines in the document: "+lineCount+NEW_LINE;
	
	//buildWordCountTable();
	buildTrigramTable();
	buildEditDistanceTableForTrigrams();
	htmlContent = "<html>"+STYLE+"<body>" + body+ "</body></html>";
	
	writeToFile(htmlContent);
}

/*
	Builds a tabular representation of the the words and their frequencies
*/
function buildWordCountTable(){
	
	var content = "The words and their frequency are:"+NEW_LINE;
	content += START_TABLE;
	content += HEADER_START + "Words"+ HEADER_END + HEADER_START +"Frequency" +HEADER_END
	var sortedWords = sortDesc(wordIndex);
	var wordsLen = sortedWords.length;
	for(var i = 0; i < wordsLen; i++){
		var word = 	sortedWords[i].key;
		var frequency = sortedWords[i].value;
		content += START_ROW +START_COL + word + END_COL + START_COL + frequency + END_COL + END_ROW;		
	}
	content += END_TABLE;
	body += content;
}

/*
	Initialize the HTML content of the data
*/
function buildTrigramTable(){
	var content = "The 10 most common trigrams are: "+NEW_LINE;
	content += START_TABLE;
	content += HEADER_START + "Common Trigrams"+ HEADER_END + HEADER_START +"Frequency" +HEADER_END
	sortedTrigrams = sortDesc(trigramIndex);
	//clear the trigramIndex object and use sortedTrigrams array for further operations
	trigramIndex = null;
	console.log(trigramIndex);
	
	var count = 10;
	for(var i = 0; i < sortedTrigrams.length && count-- > 0; i++){
		var trigrams = 	sortedTrigrams[i].key;
		var frequency = sortedTrigrams[i].value;
		content += START_ROW +START_COL + trigrams + END_COL + START_COL + frequency + END_COL + END_ROW;		
	}
	content += END_TABLE;
	body += content;
}

/*
	Builds a tabular representation of the the trigrams and their frequencies
*/
function buildEditDistanceTableForTrigrams(){
	var mostCommonTrigram = sortedTrigrams[0].key;
	var content = "The most common trigrams is: "+mostCommonTrigram;
	content += START_TABLE;
	content += HEADER_START + "Common Trigrams"+ HEADER_END + HEADER_START +"Edit distance from the most common trigram" +HEADER_END
	
	var count = 10;
	for(var i = 1; i < sortedTrigrams.length && count-- > 0; i++){
		var trigrams = 	sortedTrigrams[i].key;
		//console.log(trigrams.replace(/[,]/g, " "), mostCommonTrigram.replace(/[,]/g, " "));
		var editDistance = findEditDistance(trigrams.replace(/[,]/g, " "), mostCommonTrigram.replace(/[,]/g, " "));
		content += START_ROW +START_COL + trigrams + END_COL + START_COL + editDistance + END_COL + END_ROW;		
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
	console.log("Writing contents to the file: "+htmlFile);
	fs.writeFile(htmlFile, data, function(err){
		if(err){
			return console.error(err);
		}
		console.log("Data written successfully to the file");
	});
}

























