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

var list = {"I": 100, "am": 75, "a": 116, "cat": 15};
var arr = sortDesc(list);
console.log(arr);