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

    input:List2D2<number>
    vertices:List2D2<number>
    edges:List2D2<[number,number]>
    tiles:RuleTile[] = []
    output:List2D2<number>

    constructor(){
        this.input = new List2D2<number>()
        this.vertices = new List2D2<number>()
        this.edges = new List2D2<[number,number]>()
        this.output = new List2D2<number>()
    }

    processAll():void{
        this.vertices.loop2d(v => {
            this.processTile2(v)
        })
    }

    processTile(v:Vector){
        var neighbours = this.getNeighbours(v)
        var firsttile = this.tiles.find(r => r.cb(neighbours))
        if(firsttile){
            this.output.set(v,firsttile.tileid)
        }
    }

    processTile2(v:Vector){
        var neighbours = this.getVertexNeighbours(v)
        var firsttile = this.tiles.find(r => r.cb(neighbours))
        if(firsttile){
            this.output.set(v,firsttile.tileid)
        }
    }

    processAround(pos:Vector){
        var dirs = [new Vector(-1,-1),new Vector(0,-1),new Vector(0,0),new Vector(-1,0)]
        for(var direction of dirs){
            var abspos = pos.c().add(direction)
            this.processTile2(abspos)
        } 
    }

    getNeighbours(pos:Vector):Map<Directions,number>{
        var res = new Map<Directions,number>()
        for(var [key,value] of dir2vecmap){
            res.set(key,0)//guarantees the void neigbhours are set to 0
        }

        for(var [alias,direction] of dir2vecmap.entries()){
            var abspos = pos.c().add(direction)
            res.set(alias,this.input.get(abspos))
        }   
        return res
    }

    getVertexNeighbours(pos:Vector):Map<Directions,number>{
        var res = new Map<Directions,number>()
        for(var [key,value] of dir2vecmap){
            res.set(key,0)//guarantees the void neigbhours are set to 0
        }
        // res.set(Directions.mm,this.input.get(pos))

        var vertexneighbours = [new Vector(0,0),new Vector(1,0),new Vector(0,1),new Vector(1,1),]
        var vertexdirections = [Directions.tl,Directions.tr,Directions.bl,Directions.br]
        for(var i = 0; i < vertexneighbours.length;i++){
            res.set(vertexdirections[i],this.vertices.get(pos.c().add(vertexneighbours[i]))) 
        }
        return res
    }

    getEdgeNeighbours(pos:Vector):Map<Directions,number>{
        var res = new Map<Directions,number>()
        for(var [key,value] of dir2vecmap){
            res.set(key,0)//guarantees the void neigbhours are set to 0
        }

        var topleftedges = this.edges.get(pos)
        var botleft = this.edges.get(pos.c().add(new Vector(1,0)))
        var topright = this.edges.get(pos.c().add(new Vector(0,1)))
        res.set(Directions.tm,topleftedges[0])
        res.set(Directions.mr,topright[1])
        res.set(Directions.ml,topleftedges[1])
        res.set(Directions.bm,botleft[0])

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
    return Array.from(checks.entries()).every(([key,value]) => ((neighbours.get(key) ?? 0) == value))
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




