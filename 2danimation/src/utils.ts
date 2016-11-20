import Vector = require('./vector')

namespace utils{
    export function map(val1:number, start1:number, stop1:number, start2:number, stop2:number){
        return start2 + (stop2 - start2) * ((val1 - start1) / (stop1 - start1))
    }

    export function inRange(min:number ,max:number ,value:number){
        if(min > max){
            var temp = min;
            min = max;
            max = temp;
        }
        return value <= max && value >= min;
    }

    export function line(ctxt:CanvasRenderingContext2D, a:Vector, b:Vector){
        
    }
}

export = utils;