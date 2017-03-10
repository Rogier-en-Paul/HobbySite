
function map(val1, start1, stop1, start2, stop2){
    return start2 + (stop2 - start2) * ((val1 - start1) / (stop1 - start1))
}

function inRange(min ,max ,value){
    if(min > max){
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}

function min(a, b){
    if(a < b)return a;
    return b;
}

function max(a, b){
    if(a > b)return a;
    return b;
}

function clamp(val, min, max){
    return this.max(this.min(val, max), min)
}

function rangeContain(a1,a2,b1,b2){//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}

function create2dArray(v, fill){
    var rows = new Array(v.x)
    for(var i = 0; i < v.x; i++){
        rows[i] = new Array(v.y)
        for(var j = 0; j < v.y; j++){
            rows[i][j] = fill
        }
    }
    return rows;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector2(evt.clientX - rect.left, evt.clientY - rect.top)
}

function createCanvasGetContext(x, y, canvasOut){
    var canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    canvasOut = canvas;
    document.body.appendChild(canvas)
    var ctxt = canvas.getContext('2d')
    return ctxt;
}

function random(min, max){
    return Math.random() * (max - min) + min
}

function randomSpread(center, spread){
    var half = spread / 2
    return random(center - half, center + half)
}

var lastUpdate = Date.now();
function loop(callback){
    var now = Date.now()
    callback(now - lastUpdate)
    lastUpdate = now
    requestAnimationFrame(() => {
        loop(callback)
    })
}

function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
}

function* iter(n){
    var i = 0;
    while(i < n)yield i++;
}

function floatEquals(a,b){
    var e = 0.00001;
    return b > (a - e) && b < (a + e)
}