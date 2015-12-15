var words = ['I', 'have', 'a', 'cat', 'I', 'have', 'a', 'car', 'Done', 'test'];
console.log(createNGram(words, 3));

function createNGram(words, nGram){
	
	var trigrams = [];
	var trigramList = [];
	var count = nGram;
	//console.log(words);
	var wordsLen = words.length;
	for(var i = 0; i < wordsLen; i++){
		var word = words[i];
		trigrams.push(word);
		count--;
		if(count == 0){
			trigramList.push(trigrams);
			trigrams = [];
			count = nGram;
			i = i - (nGram -1);
		}
	}
	//console.log(trigramList);
	return trigramList;
}