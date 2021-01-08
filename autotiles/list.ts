class List<T>{

    arr:T[] = new Array(10)
    negsize = 0
    possize = 0

    _2Dsize = new Rect(new Vector(0,0),new Vector(0,0))
    oldnegsize: number
    oldpossize: number
    // _2Dcapacity = new Rect(new Vector(-10,-10),new Vector(10,10))


    get(index:number):T{
        if(this.isInBounds(index)){
            return this.arr[this.IndexRel2abs(index)]
        }else{
            throw "out of bounds"
        }
        
    }

    get2d(index:Vector):T{
        if(this._2Dsize.collidePoint(index)){

        }else{
            //throw
        }
        var index2 = this._2Dtoo1D(index)
        return this.get(index2)
    }

    set(val:T, index:number){
        
        this.oldnegsize = this.negsize
        this.oldpossize = this.possize
        if(index < 0){
            this.negsize = Math.max(Math.abs(index),this.negsize)
        }else{
            this.possize = Math.max(index,this.possize)
        }
        this.checkResize()
        var absindex  = this.IndexRel2abs(index)
        this.arr[absindex] = val
    }

    start(){
        return -this.negsize
    }

    set2d(index:Vector,val:T){
        if(this._2Dsize.collidePoint(index)){
            var index2 = this._2Dtoo1D(index)
            return this.set(val,index2)
        }else{
            //create boundingbox with current 2dsize and index position
            var newboundingbox:Rect = this.expandBoundingBox(index)
            this.set2dSize(newboundingbox)
            // this.resize()
            //increase 2d boundingbox size
            //create new list
            //write old data to the new list
        }
        
    }

    expandBoundingBox(newpoint:Vector){
        return new Rect(
            new Vector(Math.min(newpoint.x,this._2Dsize.min.x),Math.min(newpoint.y,this._2Dsize.min.y)),
            new Vector(Math.max(newpoint.x,this._2Dsize.max.x),Math.max(newpoint.y,this._2Dsize.max.y))
        )
    }

    set2dSize(newboundingbox:Rect){
        var oldsize = this._2Dsize.size()
        var newsize = newboundingbox.size()
        var newarray = new Array(newsize.x * newsize.y)
        
        oldsize.loop2d(v => {
            newarray[v.y * newsize.x + v.x] = this.get2d(v)
        })
        
        this.negsize = Math.abs(Math.min(newboundingbox.min.x,0)) * Math.abs(Math.min(newboundingbox.min.y,0))
        this.possize = Math.max(newboundingbox.max.x,1) * Math.max(newboundingbox.max.y,1)
        this._2Dsize = newboundingbox
        this.arr = newarray
    }

    containeditems(v:Vector){
        return v.x * (v.y + 1)
    }

    length(){
        return this.negsize + this.possize
    }

    isInBounds(relindex){
        return inRange(-this.negsize,this.possize - 1,relindex)
    }

    checkResize(){
        if((this.negsize + this.possize) > this.arr.length){
            this.resize((this.negsize + this.possize) * 2)
        }
    }

    resize(newsize){
        var newarray = new Array(newsize)
        //copy all positive values to the beginning
        arrcopy(this.arr,0,newarray,0,this.oldpossize)
        //copy all negative values to the end
        arrcopy(this.arr,this.arr.length - this.oldnegsize,newarray,newarray.length - this.oldnegsize,this.oldnegsize)
    }

    IndexRel2abs(index:number){
        return mod(index,this.arr.length)
    }

    _2Dtoo1D(v:Vector){
        return v.y * this._2Dsize.size().x + v.x
    }
}

class List2D<T>{

    arr:T[] = []

    constructor(public dimensions:Vector,fill:T){
        this.arr = new Array(dimensions.x * dimensions.y)
        this.arr.fill(fill)
    }
    
    get(index:Vector):T{
        return this.arr[this.index2Dto1D(index)]
    }

    set(index:Vector,val:T){
        this.arr[this.index2Dto1D(index)] = val
    }

    index2Dto1D(index:Vector){
        return index.y * this.dimensions.x + index.x
    }

    toGrid():number[][]{
        var res = create2DArray(this.dimensions,(pos) => this.get(pos))
        return res
    }

}

function arrcopy<T>(src:T[],srcstart:number,dst:T[],dststart:number,length:number){
    for(var i = 0; i < length;i++){
        dst[dststart + i] = src[srcstart + i]
    }
}