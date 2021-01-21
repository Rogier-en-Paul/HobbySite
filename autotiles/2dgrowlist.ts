class List2D2<T>{

    list:NegativeList<NegativeList<T>>
    bounding:Rect

    constructor(){
        this.list = new NegativeList()
        this.bounding = new Rect(new Vector(-5,-5),new Vector(5,5))
        var size = this.bounding.size()
        this.list.resize(size.x * size.y)
    }


    loop2d(cb:(v:Vector,val:T) => void){
        var index = new Vector(0,0)
        for(index.x = this.list.start(); index.x < this.list.end(); index.x++){
            var list = this.list.get(index.x)
            if(list != null){
                for(index.y = list.start(); index.y < list.end(); index.y++){
                    cb(index,list.get(index.y))
                }
            }
        }
    }
    
    isInBounds(index:Vector):boolean{
        return inRange(this.bounding.min.x,this.bounding.max.x - 1,index.x) &&
        inRange(this.bounding.min.y,this.bounding.max.y - 1,index.y)
    }

    get(index:Vector):T{
        return this.list.get(index.x)?.get(index.y) ?? null
    }

    set(index:Vector,val:T){
        if(this.list.get(index.x) == null){
            this.list.set(new NegativeList<T>(),index.x)
        }
        this.list.get(index.x).set(val,index.y)

        // this.bounding.min.x = Math.min()
        // this.bounding.min.y
        // this.bounding.max.x
        // this.bounding.max.y
    }


}

class NegativeList<T>{

    arr:T[] = new Array(10)
    negsize = 0
    possize = 0
    oldnegsize: number
    oldpossize: number

    get(index:number):T{
        if(this.isInBounds(index)){
            return this.arr[this.IndexRel2abs(index)]
        }else{
            return null
        }
        
    }

    set(val:T, index:number){
        
        this.oldnegsize = this.negsize
        this.oldpossize = this.possize
        if(index < 0){
            this.negsize = Math.max(Math.abs(index),this.negsize)
        }else{
            this.possize = Math.max(index + 1,this.possize)
        }
        this.checkResize()
        var absindex  = this.IndexRel2abs(index)
        this.arr[absindex] = val
    }

    start(){
        return -this.negsize
    }

    end(){
        return this.possize
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
        this.arr = newarray
    }

    IndexRel2abs(index:number){
        return mod(index,this.arr.length)
    }
}

class GrowList{

}