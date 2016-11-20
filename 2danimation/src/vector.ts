import Bone = require('./bone')

class Vector{
    x:number;
    y:number;
    
    constructor(x:number = 0, y:number = 0){
        this.x = x;
        this.y = y;
    }

    add(vector:Vector):Vector{
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector:Vector):Vector{
        this.x -= vector.x;
        this.y -= vector.y;
        return this
    }

    length(){
        return Math.pow(this.x * this.x + this.y * this.y, 0.5);
    }

    normalize(){
        var length = this.length();
        return this.scale(1 / length)
    }

    scale(scalar:number):Vector{
        this.x *= scalar;
        this.y *= scalar
        return this;
    }

    rotate(r:number, origin:Vector = new Vector()):Vector{
        var offset = this.copy().subtract(origin)
        var x = offset.x * Math.cos(r) - offset.y * Math.sin(r)
        var y = offset.x * Math.sin(r) + offset.y * Math.cos(r)
        offset.x = x; offset.y = y;
        var back = offset.add(origin)
        this.x = back.x; this.y = back.y;
        return this;
    }

    lerp(vector:Vector, weigth:number){
        return this.scale(1 - weigth).add(vector.copy().scale(weigth))
    }

    copy():Vector{
        return new Vector(this.x, this.y)
    }

    set(vector:Vector):Vector{
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    perpDot(vector:Vector):number{
        return Math.atan2( this.x * vector.y - this.y * vector.x, this.x * vector.x + this.y * vector.y )
    }

    draw(ctxt:CanvasRenderingContext2D){
        var width = 10;var half = width / 2;
        ctxt.fillRect(this.x - half, this.y - half, width, width);
    }
}

export = Vector;