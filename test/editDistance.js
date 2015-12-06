
var string1 = "abcde";
var string2 = "bcdef";
console.log(findEditDistance(string1, string2));


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
	console.log(arr);
	return arr[length2];
}