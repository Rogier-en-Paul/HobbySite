class Vector{

    static construct(dimensions){
        switch(dimensions){
            case 3:return new Vector3(0,0,0);
            default:return new Vector2(0,0);
        }
    }

    add(v){
        return this.iterate((i) => this.set(i, this.get(i) + v.get(i)))
    }

    sub(v){
        return this.iterate((i) => this.set(i, this.get(i) - v.get(i)))
    }

    scale(s){
        return this.iterate((i) => this.set(i, this.get(i) * s))
    }

    normalize(){
        return this.scale(1 / this.length())
    }

    length(){
        var sum = 0;
        this.iterate((i) => sum += Math.pow(this.get(i)))
        return Math.pow(sum, 0.5)
    }

    lerp(v, weight){
        return this.c().add(v.c().sub(this).scale(weight));
    }

    project(v){
        return this.c().scale(this.dot(v) / this.dot(this));
    }

    dot(v){
        var sum = 0;
        this.iterate((i) => sum += this.get(i) * v.get(i));
        return sum;
    }

    c(){
        var c = Vector.construct(this.dimensions);
        return c.iterate((i) => c.set(i, this.get(i)))
    }

    equals(v){
        var equals = true;
        this.iterate((i) => {if(v.get(i) != this.get(i))equals = false})
        return equals
    }

    overwrite(v){
        return this.iterate((i) => this.set(i, v.get(i)))
    }

    iterate(callback){
        for(var i = 0; i < this.dimensions;i++)callback(i);
        return this;
    }

    loop(callback){
        var counters = new Array(this.dimensions).fill(0)
        callback(counters)
        var i = 0;
        outerLoop:
        while (true) {
            while(counters[i] == this.get(i)) {
                counters[i] = 0;
                i++;
                if (i == counters.length) break outerLoop;
            }
            counters[i]++;
            callback(counters)
            i = 0;
        }
    }

    toArray(){
        var array = new Array(this.dimensions)
        this.iterate((i) => array[i] = this.get(i))
        return array;
    }

    static fromArray(array){
        var v = Vector.construct(array.length);
        v.iterate((i) => v.set(i, array[i]));
        return v;
    }
}

class Vector2 extends Vector{

    constructor(x,y){
        super();
        this.x = x || 0;
        this.y = y || 0;
        this.dimensions = 2;
    }

    draw(ctxt){
        var size = 10;
        var halfsize = size / 2
        ctxt.fillRect(this.x - halfsize,this.y - halfsize,size,size)
    }

    get(i){
        switch(i){
            case 1: return this.y;
            default: return this.x;
        }
    }

    set(i, val){
        switch(i){
            case 1:
                this.y = val;
                break;
            default:
                this.x= val;
        }
    }
}

class Vector3 extends Vector2{

    constructor(x,y,z){
        super(x, y);
        this.z = z || 0;
        this.dimensions = 3;
    }

    cross(v){
        return new Vector3(
                y * v.z - z * v.y,
                z * v.x - x * v.z,
                x * v.y - y * v.x
        );
    }

    get(i){
        if(i == 2)return z;
        return super.get(i)
    }

    set(i, val){
        if(i == 2){
            this.z = val;
            return;
        }
        super.set(i, val)
    }
}