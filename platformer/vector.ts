export default class Vector{
    vals:number[] = []
    constructor(x, y, z = 0){
        this.vals[0] = x
        this.vals[1] = y
        this.vals[2] = z
    }

    add(v:Vector):Vector{
        return this.map((val,arr,i) => val + v.vals[i])
    }

    sub(v:Vector):Vector{
        return this.map((val,arr,i) => val - v.vals[i])
    }

    mul(v:Vector):Vector{
        return this.map((val,arr,i) => val * v.vals[i])
    }

    div(v:Vector):Vector{
        return this.map((val,arr,i) => val / v.vals[i])
    }

    scale(v:number):Vector{
        return this.map((val,arr,i) => val * v)
    }

    to(v:Vector):Vector{
        return v.c().sub(this)
    }

    floor():Vector{
        return this.map((val,arr,i) => Math.floor(val))
    }

    ceil():Vector{
        return this.map((val,arr,i) => Math.ceil(val))
    }

    lerp(v:Vector,t:number):Vector{
        return this.c().add(this.to(v).scale(t))
    }

    lengthsq():number{
        var sum = 0;
        for(var i = 0; i < this.vals.length; i++){
            sum += this.vals[i] * this.vals[i]
        }
        return sum
    }

    length():number{
        return Math.pow(this.lengthsq(),0.5)
    }

    normalize():Vector{
        return this.scale(1 / this.length())
    }

    c():Vector{
        return new Vector(0,0).overwrite(this)
    }

    overwrite(v:Vector){
        return this.map((val,arr,i) => v.vals[i])
    }

    dot(v:Vector):number{
        var sum = 0
        for(var i = 0; i < this.vals.length; i++){
            sum += this.vals[i] * v.vals[i]
        }
        return sum
    }

    get(i:number){
        return this.vals[i]
    }

    set(i:number,val:number){
        this.vals[i] = val
    }

    cross(v:Vector):Vector{
        var x = this.y * v.z - this.z * v.y
        var y = this.z * v.x - this.x * v.z
        var z = this.x * v.y - this.y * v.x
        return new Vector(x,y,z)
    }

    projectOnto(v:Vector):Vector{
        return v.c().scale(this.dot(v) / v.dot(v))  
    }

    loop2d(cb:(i:Vector) => void){
        var counter = new Vector(0,0)
        for(counter.x = 0; counter.x < this.x; counter.x++){
            for(counter.y = 0; counter.y < this.y; counter.y++){
                cb(counter)
            }   
        }
    }

    rotate2d(rotations:number,origin:Vector = new Vector(0,0)):Vector{

        return this
    }

    draw(ctxt:CanvasRenderingContext2D):Vector{

        return this
    }

    map(cb:(val,array,i) => number):Vector{
        for(var i = 0; i < this.vals.length; i++){
             this.vals[i] = cb(this.vals[i],this.vals,i)
        }
        return this
    }

    get x(){
        return this.vals[0]
    }

    get y(){
        return this.vals[1]
    }

    get z(){
        return this.vals[2]
    }

    set x(val){
        this.vals[0] = val
    }

    set y(val){
        this.vals[1] = val
    }

    set z(val){
        this.vals[2] = val
    }
}

export var zero = new Vector(0,0);