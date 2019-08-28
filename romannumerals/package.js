//DM XLVII(=47), CXVI(=116), MCXX(=1120), MCMXIV(=1914)
var symbolmap = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000,
};
function filterroman(string) {
    return string.toUpperCase().split('').filter(v => symbolmap[v] != undefined).join('');
}
function roman2decimal(string) {
    string = filterroman(string);
    var numbers = string.split('').map(c => symbolmap[c]);
    // while(numbers.length > 1){
    numbers = downscale(numbers);
    // }
    return sum(numbers);
}
function downscale(numbers) {
    var values = [];
    var r = findPeakIndices(numbers);
    var peakIndices = r.peakIndices;
    var valleyIndices = r.valleyIndices;
    var values = [];
    if (numbers.length == 0) {
        return [0];
    }
    if (numbers.length == 1) {
        return [numbers[0]];
    }
    //trim end
    var endtrim = 0;
    if (peakIndices.length == 1 && valleyIndices.length == 0) {
        endtrim = sum(numbers.splice(1));
    }
    else {
        var lastindex = Math.max(last(peakIndices), last(valleyIndices));
        if (lastindex < numbers.length - 1) {
            endtrim = sum(numbers.splice(lastindex + 1));
        }
    }
    var temp;
    function custart() {
        values.push(calcMountain(0, 0, valleyIndices[0] - 1, numbers));
        peakIndices.shift();
    }
    function cutend() {
        temp = calcMountain(last(valleyIndices), numbers.length - 1, numbers.length - 1, numbers);
        peakIndices.pop();
        numbers.splice(last(valleyIndices));
    }
    var lastval = 0;
    if (peakIndices.length > valleyIndices.length) {
        // V
        //cut end and start
        custart();
        cutend();
    }
    else if (peakIndices.length == valleyIndices.length) {
        if (r.peakFirst) {
            // V| cut start
            custart();
            lastval = numbers[last(valleyIndices)];
        }
        else {
            //N cut end
            cutend();
        }
    }
    else { //peakIndices.length < valleyIndices.length    
        // ^
        lastval = numbers[last(valleyIndices)];
    }
    for (var i = 0; i < peakIndices.length; i++) {
        var lefti = valleyIndices[i];
        var peaki = peakIndices[i];
        var righti = valleyIndices[i + 1] - 1;
        values.push(calcMountain(lefti, peaki, righti, numbers));
    }
    values[values.length - 1] += lastval;
    if (temp != null) {
        values.push(temp);
    }
    values[values.length - 1] += endtrim;
    return values;
}
function sum(arr) {
    return arr.reduce((acc, c) => acc + c, 0);
}
function last(arr) {
    return arr[arr.length - 1];
}
// start and end are inclusive
function calcMountain(starti, peaki, endi, arr) {
    var sum = 0;
    //upslope
    var flatsums = [];
    var flatsum = 0;
    for (var i = starti; i < peaki; i++) {
        if (arr[i] == arr[i + 1]) {
            flatsum += arr[i];
        }
        else {
            flatsum += arr[i];
            flatsums.push(flatsum);
            flatsum = 0;
        }
    }
    var upslopesum = flatsums.reduce((acc, c) => c - acc, 0);
    //downslope
    for (var i = peaki; i <= endi; i++) {
        sum += arr[i];
    }
    return sum - upslopesum;
}
function findPeakIndices(arr) {
    if (arr.length == 0) {
        return { peakFirst: 1, peakIndices: [], valleyIndices: [] };
    }
    else {
        var peakIndices = [];
        var valleyIndices = [];
        var evaluators = [(a, b) => b - a, (a, b) => a - b];
        var arrs = [valleyIndices, peakIndices];
        var ipf = isPeakFirst(arr);
        arrs[ipf.isPeak].push(0);
        var scanning2peak = 1 - ipf.isPeak;
        var i = ipf.firstChangeIndex;
        while (i < arr.length) {
            let res = scan2extreme(arr, i, evaluators[scanning2peak]);
            arrs[scanning2peak].push(res.peaki);
            i = res.trailingEdgeIndex;
            scanning2peak = 1 - scanning2peak;
        }
        return {
            peakFirst: ipf.isPeak,
            peakIndices,
            valleyIndices,
        };
    }
}
function isPeakFirst(arr) {
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return {
                isPeak: 1,
                firstChangeIndex: i,
            };
        }
        else if (arr[i] > arr[i - 1]) {
            return {
                isPeak: 0,
                firstChangeIndex: i,
            };
        }
        else {
            continue;
        }
    }
    return {
        isPeak: 1,
        firstChangeIndex: arr.length
    };
}
function scan2extreme(arr, starti, evaluator) {
    var besti = starti;
    var i = starti + 1;
    for (; i < arr.length; i++) {
        var current = arr[i - 1];
        var leadingedge = arr[i];
        var score = evaluator(leadingedge, current);
        if (score > 0) {
            besti = i;
        }
        if (score < 0) {
            return {
                peaki: besti,
                trailingEdgeIndex: i
            };
        }
    }
    return {
        peaki: besti,
        trailingEdgeIndex: i
    };
}
var romaninput = document.querySelector('#romaninput');
var output = document.querySelector('#output');
romaninput.addEventListener('input', () => {
    output.innerText = roman2decimal(romaninput.value);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdURBQXVEO0FBRXZELElBQUksU0FBUyxHQUFHO0lBQ1osR0FBRyxFQUFDLENBQUM7SUFDTCxHQUFHLEVBQUMsQ0FBQztJQUNMLEdBQUcsRUFBQyxFQUFFO0lBQ04sR0FBRyxFQUFDLEVBQUU7SUFDTixHQUFHLEVBQUMsR0FBRztJQUNQLEdBQUcsRUFBQyxHQUFHO0lBQ1AsR0FBRyxFQUFDLElBQUk7Q0FDWCxDQUFBO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBYTtJQUM5QixPQUFPLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN6RixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsTUFBYTtJQUNoQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRTVCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDckQsNkJBQTZCO0lBQzdCLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDNUIsSUFBSTtJQUdKLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxPQUFnQjtJQUMvQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDZixJQUFJLENBQUMsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDaEMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFdBQVcs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