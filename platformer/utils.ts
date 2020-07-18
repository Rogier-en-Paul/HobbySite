import Vector from "./vector";

var lastUpdate = Date.now();
var TAU = Math.PI * 2
export {
    keys,
    TAU,
}

export function loop(callback:(dtseconds:number) => void){
    var now = Date.now()
    callback((now - lastUpdate) / 1000)
    lastUpdate = now
    requestAnimationFrame(() => {
        loop(callback)
    })
}

export function findbestIndex<T>(list:T[], evaluator:(v:T) => number):number {
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

export function findbest<T>(list:T[], evaluator:(v:T) => number):T {
    return list[findbestIndex(list,evaluator)]
}
var keys = {}


document.addEventListener('keydown', e => {
    keys[e.key] = true
})

document.addEventListener('keyup', e => {
    keys[e.key] = false  
})

export function get2DMoveInputYflipped(){
    var res = new Vector(0,0)
    if(keys['w']){
        res.y--
    }
    if(keys['s']){
        res.y++
    }
    if(keys['a']){
        res.x--
    }
    if(keys['d']){
        res.x++
    }
    return res
}

export function inRange(min,max,v){
    return v >= min && v <= max
}

export function map(val:number,from1:number,from2:number,to1:number,to2:number):number{
    return lerp(to1,to2,inverseLerp(val,from1,from2))
}

export function inverseLerp(val:number,a:number,b:number):number{
    return to(a,val) / to(a,b)
}

export function to(a:number,b:number){
    return b - a
}

export function lerp(a:number,b:number,t:number){
    return a + to(a,b) * t
}

export function swap(arr,a,b){
    var temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
}

export function fillRect(ctxt:CanvasRenderingContext2D,pos:Vector,size:Vector){
    ctxt.fillRect(pos.x, pos.y, size.x, size.y)
}

export function line(ctxt:CanvasRenderingContext2D,origin:Vector,destination:Vector){
    ctxt.beginPath()
    var dir = origin.to(destination).normalize().scale(0.5)
    ctxt.moveTo(Math.round(origin.x) + 0.5 - dir.x,Math.round(origin.y) + 0.5 - dir.y)
    ctxt.lineTo(Math.round(destination.x) + 0.5  - dir.x,Math.round(destination.y) + 0.5 - dir.y)
    ctxt.stroke()
}

export function gen2Darray<T>(size:Vector,cb:(i:Vector) => T):T[][]{
    var res:T[][] = []
    var index = new Vector(0,0)
    for(index.y = 0; index.y < size.y; index.y++){
        var row:T[] = []
        res.push(row)
        for(index.x = 0; index.x < size.x; index.x++){
            row.push(cb(index))
        }
    }
    return res
}

export function createCanvas(x: number, y: number){
    var canvas = document.createElement('canvas')
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas)
    var ctxt = canvas.getContext('2d')
    return {ctxt:ctxt,canvas:canvas};
}

export function clamp(val,min,max){
    return Math.max(Math.min(val,max),min)
}

export function lengthen(val,amount){
    return val + amount * Math.sign(val)
}

export function floor(val){
    return Math.floor(val)
}

export function ceil(val){
    return Math.ceil(val)
}

export function round(val){
    return Math.round(val)
}

export function random(){
    return Math.random()
}

export function min(a,b){
    return Math.min(a,b)
}

export function max(a,b){
    return Math.max(a,b)
}

