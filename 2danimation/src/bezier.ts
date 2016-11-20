import Vector = require('./Vector')
import Utils = require('./utils')

class Bezier{

    degree:number
    path:Vector[]

    constructor(path:Vector[], degree:number){
        if(path.length < degree + 1 || path.length % degree == 0)throw new Error('path.length < degree + 1 || path.length % degree == 0');
        this.path = path;
        this.degree = degree;                
    }

    static pathlerp(t:number, path:Vector[]):Vector{
        var pos = Utils.map(t, 0, 1, 0, path.length - 1)
        var floor = Math.floor(pos)
        return path[floor].copy().lerp(path[floor + 1], pos - floor)
    }

    static pathquerp(t:number, path:Vector[]):Vector{
        if(path.length < 3 || path.length % 2 == 0)throw new Error('path length must follow pattern 2x + 3 where x cant be negative and must be a whole number');
        var absoluteT = t * (path.length - 1)
        var floor = Math.floor(absoluteT / 2) * 2
        var ceil = floor + 2;
        return Bezier.bezier(path[floor], path[floor + 1], path[floor + 2], (absoluteT - floor) / (ceil - floor))
    }

    static bezierPath(path:Vector[], quality:number):Vector[]{
        var positions:Vector[] = [Bezier.bezier(path[0],path[1],path[2],0)]
        for(var i = 2; i < path.length; i += 2){//2 instead of 3 for overlap
            for(var j = 1; j <= quality; j++){
                var t = j / quality;
                positions.push(Bezier.bezier(path[i - 2], path[i - 1], path[i], t))
            }
        }
        return positions;
    }

    static bezier(A:Vector, B:Vector, C:Vector, t:number):Vector{
        return A.copy().scale(Math.pow((1 - t), 2)).add(
            B.copy().scale(2 * (1 - t) * t)).add(
                C.copy().scale(t * t))
    }

    static pathFindRoot(x:number, path:Vector[]):number{
        if(path.length < 4 || (path.length - 1) % 3 != 0)throw new Error('path length must follow pattern 3x + 4 where x cant be negative and must be a whole number');
        if(!Utils.inRange(path[0].x, path[path.length - 1].x, x))throw new Error('cant guarantee x intersects with the graph')
        for(var  i = 0; i < path.length - 3; i+=3){
            if(Utils.inRange(path[i].x, path[i + 3].x, x))return Bezier.findRoot(path[i], path[i + 1], path[i + 2], path[i + 3], x)
        }
        throw new Error('x outside base points or x out of range of path');
        
    }

    static findRoot(A:Vector, B:Vector, C:Vector, D:Vector, x:number):number{
        var fudge = 0.001
        var t = 0.5
        var precision = 0.25
        var spot = Bezier.cubier(A,B,C,D,t) 
        while(!Utils.inRange(spot.x - fudge, spot.x + fudge, x)){
            if(spot.x > x)t -= precision
            else t += precision
            precision /= 2;
            spot = Bezier.cubier(A,B,C,D,t)
        }
        
        return spot.y
    }

    static cubier(A:Vector, B:Vector, C:Vector, D:Vector, t:number):Vector{
        var pow = Math.pow;var it = 1 - t;
        return A.copy().scale(pow(it, 3)).add(B.copy().scale(3 * pow(it, 2) * t)).add(C.copy().scale(3 * it * t * t)).add(D.copy().scale(pow(t, 3)))
    }
}

export = Bezier