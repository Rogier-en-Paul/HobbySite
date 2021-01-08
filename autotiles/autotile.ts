enum Directions {tl,tm,tr,ml,mm,mr,bl,bm,br}

var dir2vecmap = new Map<Directions,Vector>()
dir2vecmap.set(Directions.tl,new Vector(-1,-1))
dir2vecmap.set(Directions.tm,new Vector(0,-1))
dir2vecmap.set(Directions.tr,new Vector(1,-1))
dir2vecmap.set(Directions.ml,new Vector(-1,0))
dir2vecmap.set(Directions.mm,new Vector(0,0))
dir2vecmap.set(Directions.mr,new Vector(1,0))
dir2vecmap.set(Directions.bl,new Vector(-1,1))
dir2vecmap.set(Directions.bm,new Vector(0,1))
dir2vecmap.set(Directions.br,new Vector(1,1))

var vec2dirmap = new Map<number,Directions>()

for(var [dir,vec] of dir2vecmap){
    vec2dirmap.set(hashVector(vec),dir)
}

function rotate90(v:Vector){
    return new Vector(-v.y,v.x)
}

function rotate180(v:Vector){
    return new Vector(-v.x,-v.y)
}

function rotate270(v:Vector){
    return new Vector(v.y,-v.x)
}

function rotateDirection90(d:Directions){
    var v = dir2vecmap.get(d)
    var rotted = rotate90(v)
    return vec2dirmap.get(hashVector(rotted))
}

class RuleTile{

    constructor(
        public tileid:number,
        public cb:(neighbours:Map<Directions,number>) => boolean,
    ){

    }
}

function normalRule(tileid:number,setofpositionwithids:Map<Directions,number>):RuleTile{
    return new RuleTile(tileid,(neighbours) => {
        return checkdirections(setofpositionwithids,neighbours)
    })
}

function rotated(tileids:number[],setofpositionwithids:Map<Directions,number>):RuleTile[]{
    var res:RuleTile[] = []
    let zero = setofpositionwithids
    let _90 = rotateDirectionMap(zero)
    let _180 = rotateDirectionMap(_90)
    let _270 = rotateDirectionMap(_180)

    res.push(new RuleTile(tileids[0],(neighbours) => {
        return checkdirections(zero,neighbours)
    }))
    res.push(new RuleTile(tileids[1],(neighbours) => {
        return checkdirections(_90,neighbours)
    }))
    res.push(new RuleTile(tileids[2],(neighbours) => {
        return checkdirections(_180,neighbours)
    }))
    res.push(new RuleTile(tileids[3],(neighbours) => {
        return checkdirections(_270,neighbours)
    }))


    return res
}

function mirrorX(tileid:number,setofpositionwithids:Map<Directions,number>):RuleTile[]{
    var map = mirrorXDirectionMap(setofpositionwithids)
    var original = new RuleTile(tileid,(neighbours) => {
        return checkdirections(setofpositionwithids,neighbours)
    })
    var res = new RuleTile(tileid,(neighbours) => {
        return checkdirections(map,neighbours)
    })
    return [original,res]
}

function mirrorY(tileid:number,setofpositionwithids:Map<Directions,number>):RuleTile[]{
    var map = mirrorYDirectionMap(setofpositionwithids)
    var original = new RuleTile(tileid,(neighbours) => {
        return checkdirections(setofpositionwithids,neighbours)
    })
    var res = new RuleTile(tileid,(neighbours) => {
        return checkdirections(map,neighbours)
    })
    return [original,res]
}


class AutoTiler{

    input:List2D<number>
    tiles:RuleTile[] = []
    gridrect: Rect
    output:number[][]

    constructor(){

    }

    setup(input:List2D<number>){
        this.input = input
        
        this.output = create2DArray(this.input.dimensions,() => 0)
        this.gridrect = new Rect(new Vector(0,0), this.input.dimensions.c().add(new Vector(-1,-1)))
    }

    processAll():void{
        this.input.dimensions.loop2d(v => {
            this.processTile(v)
            
        })
    }

    processTile(v:Vector){
        var neighbours = this.getNeighbours(v)
        var firsttile = this.tiles.find(r => r.cb(neighbours))
        if(firsttile){
            write2D(this.output,v,firsttile.tileid)
        }
    }

    processAround(pos:Vector){
        for(var [alias,direction] of dir2vecmap.entries()){
            var abspos = pos.c().add(direction)
            if(this.gridrect.collidePoint(abspos)){
                this.processTile(abspos)
            }
        } 
    }

    getNeighbours(pos:Vector):Map<Directions,number>{
        var res = new Map<Directions,number>()
        for(var [key,value] of dir2vecmap){
            res.set(key,0)//guarantees the void neigbhours are set to 0
        }

        for(var [alias,direction] of dir2vecmap.entries()){
            var abspos = pos.c().add(direction)
            if(this.gridrect.collidePoint(abspos)){
                res.set(alias,this.input.get(abspos))
            }
        }   
        return res
    }
}

function mirrorXDirectionMap(setofpositionwithids:Map<Directions,number>){
    var newmap = new Map<Directions,number>()
    for(var [dir,id] of setofpositionwithids){
        var vdir = dir2vecmap.get(dir).c()
        vdir.x = -vdir.x
        var mirrordir = vec2dirmap.get(hashVector(vdir))
        newmap.set(mirrordir,id)
    }
    return newmap
}

function mirrorYDirectionMap(setofpositionwithids:Map<Directions,number>){
    var newmap = new Map<Directions,number>()
    for(var [dir,id] of setofpositionwithids){
        var vdir = dir2vecmap.get(dir).c()
        vdir.y = -vdir.y
        var mirrordir = vec2dirmap.get(hashVector(vdir))
        newmap.set(mirrordir,id)
    }
    return newmap
}

function rotateDirectionMap(setofpositionwithids:Map<Directions,number>){
    var newmap = new Map<Directions,number>()
    for(var [dir,id] of setofpositionwithids){
        newmap.set(rotateDirection90(dir),id)
    }
    return newmap
}

function checkdirections(checks:Map<Directions,number>,neighbours:Map<Directions,number>){
    return Array.from(checks.entries()).every(([key,value]) =>  neighbours.get(key) == value)
}


function hashVector(v:Vector){
    return v.x + v.y * 1000
}

function write2D<T>(arr:T[][],v:Vector,val:T){
    arr[v.y][v.x] = val
    return arr
}

function read2D<T>(arr:T[][],v:Vector):T{
    return arr[v.y][v.x]
}




