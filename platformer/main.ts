import {loop, createCanvas, clamp, keys} from './utils'
import {World, Entity} from './world'
import { PlatformController } from './platformController'
import Vector from './vector'
import { Block } from './block'
import { TopDownController } from './topdownController'

var x = window as any
x.keys = keys
// keys['d'] = true
var grid = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
    [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
    [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1],
]
var gridsize = new Vector(grid[0].length,grid.length)
var world = new World(gridsize,40)
world.grid = grid
var platformController = new PlatformController(new Entity(Block.fromSize(new Vector(world.tilesize,world.tilesize).mul(new Vector(12,12)), new Vector(40,40))),world)
// var topdownController = new TopDownController(new Entity(Block.fromSize(new Vector(world.tilesize,world.tilesize).mul(new Vector(12,12)), new Vector(40,40))),world)
var screensize = gridsize.c().scale(world.tilesize)
var {canvas,ctxt} = createCanvas(screensize.x,screensize.y)
// platformController.body.block.set(new Vector(40,40),new Vector(0,0))
// platformController.body.speed = new Vector(0,100)

loop((dt) => {
    if(keys['p']){
        keys['p'] = false
        debugger
    }
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    dt = clamp(dt,0.005,0.1)
    world.update(dt)
    
    world.debugDrawGrid(ctxt)
    world.debugDrawRays(ctxt)
    world.emptyFiredRays()

})

