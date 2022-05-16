class RNG{
    public mod:number = 4294967296
    public multiplier:number = 1664525
    public increment:number = 1013904223

    constructor(public seed:number){

    }

    next(){
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod
        return this.seed
    }

    norm(){
        return this.next() / this.mod
    }
    
    range(min:number,max:number){
        return lerp(min,max,this.norm())
    }

    rangeFloor(min:number,max:number){
        return Math.floor(this.range(min,max))
    }

    choose<T>(arr:T[]):T{
        return arr[this.rangeFloor(0,arr.length)]
    }

    shuffle<T>(arr:T[]):T[]{
        for(var end = arr.length; end > 0; end--) {
          swap(arr,this.rangeFloor(0,end), end)
        }
        return arr;
    }
}