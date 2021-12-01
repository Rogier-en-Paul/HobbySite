
class Rect{

    constructor(public min:Vector, public max:Vector){
    }

    collidePoint(point:Vector){
        
        for (var i = 0; i < this.min.vals.length; i++) {
			if (!inRange(this.min.vals[i], this.max.vals[i], point.vals[i])) {
				return false;
			}
		}
		return true;
    }

    size():Vector{
        return this.min.to(this.max)
    }

    collideBox(other:Rect){
        for(var i = 0; i < 2; i++){
			if(!rangeOverlap(this.min[i], this.max[i], other.min[i], other.max[i])){
				return false;
			}
		}
		return true;
    }


    getPoint(relativePos:Vector):Vector{
        return this.min.c().add(this.size().mul(relativePos))
    }

    draw(ctxt:CanvasRenderingContext2D){
       var size = this.size()
       ctxt.fillRect(this.min.x,this.min.y,size.x,size.y)
    }

    move(pos:Vector){
        var size = this.size()
        this.min = pos
        this.max = this.min.c().add(size)
    }

    loop(callback:(v:Vector)=>void){
        var temp = this.max.c()
        

        this.size().loop(v2 => {
            temp.overwrite(v2)
            temp.add(this.min)
            callback(temp)
        })
    }
}

function rangeOverlap(range1A:number,range1B:number,range2A:number,range2B:number){
    return range1A <= range2B && range2A <= range1B
}