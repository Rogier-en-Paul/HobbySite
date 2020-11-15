
var TAU = Math.PI * 2
function map(val:number,from1:number,from2:number,to1:number,to2:number):number{
    return lerp(to1,to2,inverseLerp(val,from1,from2))
}

function inverseLerp(val:number,a:number,b:number):number{
    return to(a,val) / to(a,b)
}

function inRange(min: number, max: number, value: number):boolean{
    if(min > max){
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}

function min(a: number, b: number): number{
    if(a < b)return a;
    return b;
}

function max(a: number, b: number): number{
    if(a > b)return a;
    return b;
}

function clamp(val: number, min: number, max: number): number{
    return this.max(this.min(val, max), min)
}

function rangeContain(a1: number, a2: number, b1: number, b2: number):boolean{//as in does a enclose b----- so returns true if b is smaller in all ways
    return max(a1, a2) >= max(b1, b2) && min(a1,a2) <= max(b1,b2);
}


function getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top)
}

function createCanvas(x: number, y: number){
    var canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas)
    var ctxt = canvas.getContext('2d')
    return {ctxt:ctxt,canvas:canvas};
}

function random(min: number, max: number){
    return Math.random() * (max - min) + min
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

function mod(number: number, modulus: number){
    return ((number%modulus)+modulus)%modulus;
}

var keys = {}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true
})

document.addEventListener('keyup', (e) => {
    keys[e.key] = false
})

function getMoveInput():Vector{
    var dir = new Vector(0,0)
    if(keys['a'])dir.x--//left
    if(keys['w'])dir.y++//up
    if(keys['d'])dir.x++//right
    if(keys['s'])dir.y--//down
    return dir;
}

function getMoveInputYFlipped():Vector{
    var input = getMoveInput()
    input.y *= -1
    return input
}

function loadTextFiles(strings:string[]){
    var promises = []
    for(var string of strings){
        var promise = fetch(string)
        .then(resp => resp.text())
        .then(text => text)
        promises.push(promise)
    }
    return Promise.all(promises)
}

function loadImages(urls:string[]):Promise<HTMLImageElement[]>{
    var promises:Promise<HTMLImageElement>[] = []

    for(var url of urls){
        promises.push(new Promise((res,rej) => {
            var image = new Image()
            image.onload = e => {
                res(image)     
            }
            image.src = url
        }))
    }

    return Promise.all(promises)
}

function findbestIndex<T>(list:T[], evaluator:(v:T) => number):number {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0])
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i])
        if (score > bestscore) {
            bestscore = score
            bestIndex = i
        }
    }
    return bestIndex
}

function string2html(string): HTMLElement {
    var div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0] as HTMLElement;
}


function lerp(a:number,b:number,r:number):number{
    return a + to(a,b) * r
}

function to(a:number,b:number):number{
    return b - a;
}

function swap<T>(arr:T[],a:number = 0,b:number = 1){
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

function first<T>(arr:T[]):T{
    return arr[0]
}

function last<T>(arr:T[]):T{
    return arr[arr.length - 1]
}

function create2DArray<T>(size:Vector,filler:(pos:Vector) => T){
    var result = new Array(size.y)
    for(var i = 0; i < size.y;i++){
        result[i] = new Array(size.x)
    }
    size.loop2d(v => {
        result[v.x][v.y] = filler(v)
    })
    return result
}

function get2DArraySize(arr:any[][]){
    return new Vector(arr[0].length,arr.length)
}

function index2D<T>(arr:T[][],i:Vector){
    return arr[i.x][i.y]
}

function copy2dArray<T>(arr:T[][]){
    return create2DArray(get2DArraySize(arr),pos => index2D(arr,pos))
}

