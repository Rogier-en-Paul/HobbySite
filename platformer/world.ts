import Vector from './vector'
import { inverseLerp, findbest, inRange, to, swap, findbestIndex, line, gen2Darray, lerp, lengthen, clamp, ceil } from './utils'
import { EventSystem } from './eventsystem'
import { Block } from './block'


export class Entity{
    grounded:Vector = new Vector(0,0)
    vel:Vector = new Vector(0,0)
    minspeed:Vector = new Vector(-300,-600)
    maxspeed:Vector = new Vector(300,600)
    dir:Vector = new Vector(1,0)

    constructor(public block:Block){

    }
}

export class RaycastHit{

    constructor(
        public hit:boolean,
        public origin:Vector,
        public dir:Vector,
        public hitLocation:Vector,
        public relHitLocation:Vector,
        public normal:Vector,
        public hitIndex:Vector,
    ){

    }
    
}

export class World{

    
    grid:number[][] = []
    entities:Entity[] = []
    firedRays:RaycastHit[] = []
    beforeUpdate = new EventSystem<number>()
    afterUpdate = new EventSystem<number>()
    skinwidth = 0.01

    constructor(public gridsize:Vector, public tilesize:number){
        this.grid = gen2Darray(gridsize,() => 0)
    }

    update(dtseconds:number){
        this.beforeUpdate.trigger(dtseconds)
        for(var entity of this.entities){
            var speed = entity.vel.c().scale(dtseconds)
             
            //clamp speed
            entity.vel.map((val,arr, i) => {
                return clamp(val,entity.minspeed.get(i),entity.maxspeed.get(i))
            })

            this.move(entity,speed)
            if(speed.lengthsq() > 0){
                entity.dir = speed.c().normalize()
            }
        }
        this.afterUpdate.trigger(dtseconds)
    }

    move(entity:Entity,amount:Vector){
        this.moveAxis(entity,0,amount.x)
        this.moveAxis(entity,1,amount.y)
    }

    moveAxis(entity:Entity,axis:number,amount:number){
        if(amount == 0){
            return
        }
        var hit = this.boxCast(entity.block,axis,amount)
        entity.block.move(hit.relHitLocation)
        entity.grounded.vals[axis] = (hit.hit ? 1 : 0) * Math.sign(amount)
        if(hit.hit){
            entity.vel.vals[axis] = 0
        }
    }

    boxCast(block:Block,axis:number,amount:number,_skinwidth = this.skinwidth){
        var dir = VFromAxisAmount(axis,amount)
        if(amount == 0){
            return new RaycastHit(false,block.center(),dir,null,new Vector(0,0),null,null)
        }
        var skinblock = block.c()
        skinblock.min.add(new Vector(_skinwidth,_skinwidth))
        skinblock.max.sub(new Vector(_skinwidth,_skinwidth))

        var points = this.getPointsOnEdge(skinblock,dir)
        var rays = points.map(point => this.raycastAxisAligned(point,axis,lengthen(amount,_skinwidth)))
        var hitray = findbest(rays.filter(ray => ray.hit),ray => -ray.relHitLocation.length())
        for(var ray of rays){
            ray.relHitLocation.vals[axis] = lengthen(ray.relHitLocation.vals[axis], -_skinwidth)
            this.firedRays.push(ray)
        }
        return hitray ?? rays[0]
    }

    raycastAxisAligned(originWorld:Vector,axis,amount):RaycastHit{
        var dirWorld = VFromAxisAmount(axis,amount)
        var end = originWorld.c().add(dirWorld)
        var boxes2check = ceil(Math.abs(amount) / this.tilesize)
        for(var i = 0; i <= boxes2check; i++){
            var pos = originWorld.lerp(end,i / boxes2check)
            if(this.isBlocked(pos)){
                return this.rayCast(originWorld,dirWorld,this.getBlock(pos))
            }
        }
        return new RaycastHit(false,originWorld,dirWorld,originWorld.c().add(dirWorld),dirWorld.c(),dirWorld.c().normalize().scale(-1),null)
    }

    rayCast(origin:Vector,dir:Vector,block:Block){
        var end = origin.c().add(dir)
        var res:RaycastHit = new RaycastHit(false,origin,dir,null,null,null,null)

        var out:[number,number] = [0,0]
        
        res.hit = collideLine(origin,origin.c().add(dir),block,out)
        res.hitLocation = origin.lerp(end,out[0])
        res.relHitLocation = origin.to(res.hitLocation)
        return res
    }

    getPointsOnEdge(box:Block,dir:Vector){

        var res:Vector[] = []
        var corners = [
            box.getCorner(new Vector(0,0)),
            box.getCorner(new Vector(1,0)),
            box.getCorner(new Vector(1,1)),
            box.getCorner(new Vector(0,1)),
        ]
        corners = corners.filter(corner => box.center().to(corner).normalize().dot(dir.c().normalize()) > 0)
        
        var start = corners[0]
        var end = corners[1]
        var nofpoints = ceil(start.to(end).length() / this.tilesize) + 1
        for(var i = 0; i < nofpoints;i++){
            res.push(start.lerp(end,(i / (nofpoints - 1))))
        }

        return res
    }
    
    emptyFiredRays(){
        this.firedRays = []
    }

    isBlocked(world:Vector){
        var index = this.world2index(world)
        if(inRange(0,this.gridsize.x - 1,index.x) && inRange(0,this.gridsize.y - 1,index.y)){
            return this.grid[index.y][index.x]
        }
        return false
    }

    isBlockedIndex(index:Vector){
        return this.grid[index.y][index.x]
    }

    getBlock(world:Vector){
        var topleft = this.world2index(world).scale(this.tilesize)
        return Block.fromSize(topleft,new Vector(this.tilesize,this.tilesize))
    }

    world2index(world:Vector):Vector{
        return world.c().div(new Vector(this.tilesize,this.tilesize)).floor()
    }

    index2world(index:Vector):Vector{
        return index.c().scale(this.tilesize)
    }

    debugDrawGrid(ctxt:CanvasRenderingContext2D){
        ctxt.fillStyle = 'black'
        this.gridsize.loop2d(i => {
            if(this.isBlockedIndex(i)){
                this.getBlock(this.index2world(i)).draw(ctxt)
            }
        })
        ctxt.fillStyle = 'grey'
        for(var entity of this.entities){
            entity.block.draw(ctxt)
        }
        
    }

    debugDrawRays(ctxt:CanvasRenderingContext2D){
        for(var ray of this.firedRays){
            if(ray.hit){
                ctxt.strokeStyle = 'red'
            }else{
                ctxt.strokeStyle = 'blue'
            }
            
            var dir = ray.dir.c().normalize()
            line(ctxt,ray.origin,ray.origin.c().add(dir.scale(10)))
        }
    }
}

function VFromAxisAmount(axis:number,amount:number){
    var v = new Vector(0,0)
    v.vals[axis] = amount
    return v
}

function collideLine(a:Vector,b:Vector,box:Block,out:[number,number]):boolean{
    var clip1:[number,number] = [0,0]
    var clip2:[number,number] = [0,0]

    relIntersect(a.x,b.x, box.min.x, box.max.x, clip1)
    relIntersect(a.y,b.y, box.min.y, box.max.y, clip2)
    
    //result contains if the lines intersected
    var result = intersectLine(clip1[0],clip1[1],clip2[0],clip2[1],out)
    return result && inRange(0,1,out[0])// && inRange(0,1,out[1])
}

function relIntersect(amin:number,amax:number,bmin:number,bmax:number,out:[number,number]){
    if(amin == amax){//this could use some work
        out[0] = -Infinity
        out[1] = Infinity
        return
    }
    var length = Math.abs(to(amin, amax))
    out[0] = Math.abs(to(amin,bmin)) / length;
    out[1] = Math.abs(to(amin,bmax)) / length;
    if(amin > amax){
        swap(out,0,1)
    }
}

function intersectLine(amin:number,amax:number,bmin:number,bmax:number,out:[number,number]){
    var ibegin = Math.max(amin,bmin)
    var iend = Math.min(amax,bmax)
    out[0] = ibegin
    out[1] = iend
    if(ibegin <= iend){
        return true
    }else{
        return false
    }
}

export function applyStoppingForce(vel:Vector,dtforce:Vector){
    vel.x = moveTowards(vel.x,0,dtforce.x)
    vel.y = moveTowards(vel.y,0,dtforce.y)
}

export function moveTowards(cur:number,destination:number,maxamount:number){
    var dir = to(cur,destination)
    if(Math.abs(dir) <= maxamount){
        return destination
    }else{
        return cur + Math.sign(dir) * maxamount
    }
}