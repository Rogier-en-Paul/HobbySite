import Vector from "./vector"
import { lerp, fillRect } from "./utils"

export class Block{
    constructor(public min:Vector, public max:Vector){

    }

    static fromSize(pos:Vector,size:Vector){
        return new Block(pos,pos.c().add(size))
    }

    getCorner(v:Vector):Vector{
        return new Vector(
            lerp(this.min.x,this.max.x,v.x),
            lerp(this.min.y,this.max.y,v.y),
        )
    }

    center(){
        return this.getCorner(new Vector(0.5,0.5))
    }

    set(v:Vector,corner:Vector){
        var displacement = this.getCorner(corner).to(v)
        return this.move(displacement)
        
    }

    move(v:Vector){
        this.min.add(v)
        this.max.add(v)
        return this
    }

    size(){
        return this.min.to(this.max)
    }

    draw(ctxt:CanvasRenderingContext2D){
        var size = this.size()
        fillRect(ctxt,this.min,size)
    }

    c(){
        return new Block(this.min.c(),this.max.c())
    }
}